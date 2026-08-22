/* COLLECTORATE — controller for the two Collectorate exhibit pages.
 *
 * Same shape as LARASTELLE: one global UPPERCASE object, no modules, wired by
 * <script> order, initialized on DOMContentLoaded. It consumes the same
 * template — the sticky .pair.links anchor bar, #music-control's iframe swap,
 * .music-story's player-left / story-right — and only adds what these records
 * need that larastelle did not: per-track scrubbing over one gapless video,
 * and section chips grouped so a group can span tracks.
 *
 * Deliberately does not load js/youtube.js. That file owns larastelle's player
 * singleton; keeping these pages self-contained means nothing here can regress
 * that page.
 */

let yt_player = null;
let ct_ready = false;
let ct_raf = null;
let ct_scrub = null;      // the track being dragged, if any
let ct_pending = null;    // seek requested before the player existed
let ct_autoplay = false;
let ct_duration = 0;
let ct_tracks = [];
let ct_sections = [];
const ct_frames = new Map();

const COLLECTORATE = {
  videoId: null,
  defaultMusic: 'spotify',
  areaPlayer: '.player',
  params: { music: 's' },

  init,
  reveal: { music: source },

  retain: (name, value) => localStorage[name] ??
    (localStorage[name] = JSON.stringify(value)),
  retrieve: (name, defaultValue) =>
    JSON.parse(localStorage[name] ?? JSON.stringify(defaultValue)),
};

/* accessibility.js is generic, but it still addresses the app through a global
 * literally named LARASTELLE (retain/retrieve for persistence, reveal.story +
 * navNext/navPrevious for the swipe pager). Rather than edit that shared file —
 * larastelle.html depends on it — these pages publish the same small surface.
 * The two controllers never load together, so the name cannot collide.
 * Worth un-coupling when the template gets factored out properly. */
let navNext = null;
let navPrevious = null;
var LARASTELLE = {
  retain: COLLECTORATE.retain,
  retrieve: COLLECTORATE.retrieve,
  reveal: { story: () => false },
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.embed-note a').forEach((a) => {
    a.href = watchUrl(0);
  });
  buildTracks();
  buildStrips();
  spySections();
  bindKeys();
  // Matches larastelle: let the frames settle, then swap in the chosen source
  // so every iframe starts detached and cached.
  setTimeout(COLLECTORATE.init, 100);
});

/* ---------------------------------------------------------------- init -- */

function init() {
  const _ = COLLECTORATE;
  const params = new URLSearchParams(window.location.search);
  const player = document.querySelector(_.areaPlayer);
  if (!player) return;

  player.querySelectorAll(':scope > [id]').forEach((frame) => {
    ct_frames.set(frame.getAttribute('id'), frame);
    frame.style.display = 'none';
    frame.remove();
  });

  const wanted = params.get(_.params.music) || _.defaultMusic;
  const btn = document.querySelector(`#music-control [data-iframe="${wanted}"]`)
    || document.querySelector('#music-control [data-iframe]');
  if (btn) source(btn, /* soft */ true);
}

/* --------------------------------------------------- service switching -- */

function source(el, soft = false) {
  const id = el.getAttribute('data-iframe');
  const player = document.querySelector(COLLECTORATE.areaPlayer);

  document.querySelectorAll('#music-control > *').forEach((s) => {
    s.classList.remove('active');
    s.setAttribute('aria-selected', 'false');
  });
  el.classList.add('active');
  el.setAttribute('aria-selected', 'true');

  const label = document.querySelector('.h-audio-version');
  if (label && el.title) label.textContent = el.title.replace(/^Prefer /, '');

  ct_frames.forEach((frame) => {
    if (frame.getAttribute('id') === id) {
      frame.style.display = 'block';
      player.setAttribute('data-source', id);
      player.appendChild(frame);
      player.scrollTop = 0;
      prepPlayer(id);
      if (!soft) frame.focus();
    } else {
      frame.style.display = 'none';
      frame.remove();
    }
  });

  return false;
}

/* -------------------------------------------------------------- player -- */

const ctLoadAPI = (() => {
  let promise;
  return () => {
    if (promise) return promise;
    promise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve();
      window.onYouTubeIframeAPIReady = () => resolve();
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    });
    return promise;
  };
})();

// The frame is destroyed and rebuilt whenever the viewer leaves and returns to
// the YouTube tab, so the loader has to be re-enterable — same reason
// larastelle's is a memoized promise.
// YT.Player REPLACES its mount element with the iframe, keeping the id — so
// after destroy() there is no #yt_player div left to build into when the
// viewer comes back to this tab. Hand it a fresh div every time.
function freshMount() {
  const screen = document.querySelector('#yt_screen');
  const existing = document.getElementById('yt_player');
  if (existing) existing.remove();
  const node = document.createElement('div');
  node.id = 'yt_player';
  screen.appendChild(node);
  return node;
}

async function prepPlayer(id) {
  if (id === 'youtube' && COLLECTORATE.videoId) {
    // Re-entering the tab with a live player would otherwise stack a second one.
    if (yt_player && document.getElementById('yt_player')) return;
    await ctLoadAPI();
    yt_player = new window.YT.Player(freshMount(), {
      videoId: COLLECTORATE.videoId,
      host: 'https://www.youtube-nocookie.com',
      playerVars: { rel: 0, playsinline: 1, fs: 1 },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerState,
        onPlaybackQualityChange: onQuality,
        onError: onPlayerError,
      },
    });
  } else if (yt_player) {
    stopTicking();
    if (typeof yt_player.destroy === 'function') yt_player.destroy();
    yt_player = null;
    ct_ready = false;
    document.body.classList.remove('is-playing', 'low-quality');
  }
}

function onPlayerReady() {
  ct_ready = true;
  ct_duration = safeCall('getDuration', 0);
  if (ct_pending !== null) { safeSeek(ct_pending); ct_pending = null; }
  if (ct_autoplay) { ct_autoplay = false; safeCall('playVideo'); }
  startTicking();
  paint();
}

function onPlayerState(e) {
  const playing = e.data === window.YT.PlayerState.PLAYING;
  document.body.classList.toggle('is-playing', playing);
  if (playing) startTicking(); else stopTicking();
  paint();
}

// setPlaybackQuality has been a no-op since 2019 and quality follows the
// player's pixel size, which in this column is small. We cannot set it, but we
// can notice and point at full screen rather than just looking bad.
function onQuality(e) {
  const poor = e && (e.data === 'small' || e.data === 'medium');
  document.body.classList.toggle('low-quality', !!poor);
}

// 101 and 150 are the same condition reported two ways: this video may not be
// played inside an embed. Age-restricted uploads — anything marked explicit —
// land here, and no amount of player config gets around it. So the column stops
// pretending it has a player and becomes a deep-linked track list instead.
function onPlayerError(e) {
  if (!e || (e.data !== 101 && e.data !== 150)) return;
  document.body.classList.add('embed-blocked');
  stopTicking();
  ct_ready = false;
}

function watchUrl(seconds) {
  const t = Math.max(0, Math.floor(seconds || 0));
  return `https://www.youtube.com/watch?v=${COLLECTORATE.videoId}`
    + (t ? `&t=${t}s` : '');
}

function safeCall(method, fallback) {
  if (yt_player && typeof yt_player[method] === 'function') {
    try { return yt_player[method](); } catch (err) { /* torn down */ }
  }
  return fallback;
}

function safeSeek(seconds) {
  if (yt_player && typeof yt_player.seekTo === 'function') {
    yt_player.seekTo(seconds, true);
    return true;
  }
  return false;
}

/* --------------------------------------------------------------- model -- */

function buildTracks() {
  const rows = [...document.querySelectorAll('#youtube-chapters .track')];
  ct_tracks = rows.map((row, i) => ({
    row,
    index: i,
    start: parseFloat(row.getAttribute('data-ts')) || 0,
    end: null,
    dur: parseFloat(row.getAttribute('data-dur')) || 0,
    bar: row.querySelector('.track-bar'),
    fill: row.querySelector('.track-fill'),
  }));

  // data-dur keeps the bars live before the player loads; the next row's start
  // is the fallback, and the player's duration only backstops the last row.
  ct_tracks.forEach((t, i) => {
    if (t.dur) t.end = t.start + t.dur;
    else t.end = ct_tracks[i + 1] ? ct_tracks[i + 1].start : null;
    if (t.bar) bindScrub(t);
  });
}

function trackEnd(t) {
  if (t.end !== null) return t.end;
  return ct_duration || (t.start + 1);
}

/* --------------------------------------------------------- transport --- */

function playTrack(el) {
  const row = el.closest('.track');
  const t = ct_tracks.find((x) => x.row === row);
  if (!t) return false;
  // Embed refused: hand the viewer off to YouTube at the right second rather
  // than seek a player that will never play.
  if (document.body.classList.contains('embed-blocked')) {
    window.open(watchUrl(t.start), '_blank', 'noopener');
    return false;
  }
  seekTo(t.start, true);
  return false;
}

function seekTo(seconds, andPlay) {
  if (!yt_player || !ct_ready) {
    ct_pending = seconds;
    ct_autoplay = !!andPlay;
    return;
  }
  safeSeek(seconds);
  if (andPlay) safeCall('playVideo');
  paint(seconds);
}

function bindScrub(t) {
  const bar = t.bar;
  const fracAt = (e) => {
    const r = bar.getBoundingClientRect();
    return r.width ? Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) : 0;
  };
  const apply = (e) => {
    const frac = fracAt(e);
    drawRow(t, frac);
    seekTo(t.start + frac * (trackEnd(t) - t.start), false);
  };

  bar.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    bar.setPointerCapture(e.pointerId);
    ct_scrub = t;
    apply(e);
  });
  bar.addEventListener('pointermove', (e) => { if (ct_scrub === t) apply(e); });
  const release = (e) => {
    if (ct_scrub !== t) return;
    ct_scrub = null;
    if (bar.hasPointerCapture && bar.hasPointerCapture(e.pointerId)) {
      bar.releasePointerCapture(e.pointerId);
    }
  };
  bar.addEventListener('pointerup', release);
  bar.addEventListener('pointercancel', release);

  bar.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 15 : 5;
    let delta = 0;
    if (e.key === 'ArrowRight') delta = step;
    else if (e.key === 'ArrowLeft') delta = -step;
    else if (e.key === 'Home') { e.stopPropagation(); return seekTo(t.start, false); }
    else if (e.key === 'End') { e.stopPropagation(); return seekTo(trackEnd(t) - 1, false); }
    else return;
    e.preventDefault();
    e.stopPropagation();   // the anchor bar's own arrows must not also fire
    const now = ct_ready ? safeCall('getCurrentTime', t.start) : t.start;
    const base = (now >= t.start && now < trackEnd(t)) ? now : t.start;
    seekTo(Math.min(trackEnd(t) - 0.1, Math.max(t.start, base + delta)), false);
  });
}

/* --------------------------------------------------------------- paint -- */

function startTicking() {
  if (ct_raf) return;
  const loop = () => { paint(); ct_raf = window.requestAnimationFrame(loop); };
  ct_raf = window.requestAnimationFrame(loop);
}

function stopTicking() {
  if (ct_raf) window.cancelAnimationFrame(ct_raf);
  ct_raf = null;
}

function paint(forced) {
  const now = forced !== undefined
    ? forced
    : (ct_ready ? safeCall('getCurrentTime', 0) : 0);

  ct_tracks.forEach((t) => {
    if (ct_scrub === t) return;         // never fight a live drag
    const end = trackEnd(t);
    const span = end - t.start;
    drawRow(t, span > 0 ? Math.min(1, Math.max(0, (now - t.start) / span)) : 0);
    const active = now >= t.start && now < end;
    t.row.classList.toggle('active', active);
    if (active) t.row.setAttribute('aria-current', 'true');
    else t.row.removeAttribute('aria-current');
  });

  document.querySelectorAll('.elapsed').forEach((el) => {
    el.textContent = clock(now);
  });
}

function drawRow(t, frac) {
  if (t.fill) t.fill.style.transform = `scaleX(${frac})`;
  if (t.bar) t.bar.setAttribute('aria-valuenow', Math.round(frac * 100));
}

function clock(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* ------------------------------------------------------ section strips -- */

// Chips go in the anchor bar's .tabs slot. Grouping is data-group, not the
// track index, because a group may span tracks: PROMISE's first three are
// chapters of one thing and share a strip.
function buildStrips() {
  const tabs = document.querySelector('#chapters-control .tabs');
  if (!tabs) return;

  ct_sections = [...document.querySelectorAll('.panels .part')];
  const groups = new Map();
  ct_sections.forEach((part) => {
    const block = part.closest('.track-lyrics');
    const key = block?.getAttribute('data-group')
      ?? block?.getAttribute('data-track') ?? '0';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(part);
  });

  groups.forEach((parts, key) => {
    const strip = document.createElement('div');
    strip.className = 'strip';
    strip.setAttribute('role', 'list');

    const block = parts[0].closest('.track-lyrics');
    strip.setAttribute('aria-label',
      block?.getAttribute('data-group-label') || block?.getAttribute('data-title') || '');

    // Anchor each strip with the track number(s) it covers, so a row of bare
    // numerals still says where you are. A record whose sections map 1:1 onto
    // its tracks has only one strip and no grouping to explain, so it is left
    // unlabelled rather than tagged with its own full range.
    const nums = parts
      .map((p) => parseInt(p.closest('.track-lyrics')?.getAttribute('data-track'), 10))
      .filter((n) => !isNaN(n));
    if (nums.length && groups.size > 1) {
      const pad = (n) => String(n).padStart(2, '0');
      const lo = Math.min(...nums);
      const hi = Math.max(...nums);
      const tag = document.createElement('span');
      tag.className = 'strip-tag';
      tag.setAttribute('aria-hidden', 'true');
      tag.textContent = lo === hi ? pad(lo) : `${pad(lo)}–${pad(hi)}`;
      strip.appendChild(tag);
    }

    parts.forEach((part, i) => {
      if (!part.id) part.id = `part-${key}-${i}`;
      const b = document.createElement('button');
      b.className = 'chip';
      b.setAttribute('role', 'listitem');
      b.setAttribute('aria-controls', part.id);
      b.textContent = part.getAttribute('data-label') || '•';
      const owner = part.closest('.track-lyrics')?.getAttribute('data-title') || '';
      b.title = `${owner} — ${part.getAttribute('data-label') || ''}`.trim();
      b.addEventListener('click', () => scrollToSection(part.id));
      part._chip = b;
      strip.appendChild(b);
    });

    tabs.appendChild(strip);
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return false;
}

function spySections() {
  if (!ct_sections.length || !window.IntersectionObserver) return;
  const seen = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) seen.add(entry.target);
      else seen.delete(entry.target);
    });
    let best = null;
    seen.forEach((el) => {
      if (!best || el.getBoundingClientRect().top < best.getBoundingClientRect().top) {
        best = el;
      }
    });
    ct_sections.forEach((el) => {
      const on = el === best;
      el.classList.toggle('in-view', on);
      if (el._chip) {
        el._chip.classList.toggle('active', on);
        el._chip.setAttribute('aria-current', on ? 'true' : 'false');
      }
    });
    const head = document.querySelector('.h-text-version');
    if (head && best) {
      const owner = best.closest('.track-lyrics')?.getAttribute('data-title') || '';
      head.textContent = owner;
    }
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
  ct_sections.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------- keys -- */

function bindKeys() {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (e.target.closest && e.target.closest('.track-bar')) return;
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'ArrowLeft') {
      const prev = document.querySelector('.record-previous');
      if (prev) { e.preventDefault(); prev.click(); }
    } else if (e.key === 'ArrowRight') {
      const next = document.querySelector('.record-next');
      if (next) { e.preventDefault(); next.click(); }
    }
  });
}
