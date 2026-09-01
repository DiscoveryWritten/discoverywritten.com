/* HEALYOURSELF — controller for the Heal Yourself exhibit.
 *
 * Same shape as COLLECTORATE and LARASTELLE: one global UPPERCASE object, no
 * modules, wired by <script> order, initialized on DOMContentLoaded. It
 * consumes the same template — the sticky .pair.links anchor bar,
 * #music-control's iframe swap, .music-story's player-left / story-right — and
 * the section-chip layer is the same idea, driven off .track-lyrics / .part.
 *
 * What is different, and the only reason this file exists rather than another
 * page of collectorate.js: this record is not one gapless upload. Every track
 * is its OWN YouTube video. collectorate.js models a record as one timeline
 * that tracks carve into with data-ts offsets — start, end, seek within the
 * whole — and none of that survives contact with eleven separate videos. Here
 * a row carries data-video and its own duration, playing a track means LOADING
 * it, and only the loaded track has a live position at all.
 *
 * Self-contained on purpose, for the reason collectorate.js gives for not
 * loading js/youtube.js: five published pages depend on that controller, so
 * teaching it a second model is how those pages break. The overlap here is the
 * price of not touching them.
 */

let yt_player = null;
let hy_ready = false;
let hy_raf = null;
let hy_scrub = null;      // the track being dragged, if any
let hy_pending = null;    // {index, seconds, play} requested before the player existed
let hy_tracks = [];
let hy_sections = [];
let hy_current = 0;       // index of the track whose video is loaded
let hy_showing = 0;       // index of the lyrics panel on screen
const hy_frames = new Map();

const HEALYOURSELF = {
  defaultMusic: 'youtube',
  areaPlayer: '.player',
  params: { music: 's', track: 't' },

  init,
  reveal: { music: source },

  retain: (name, value) => localStorage[name] ??
    (localStorage[name] = JSON.stringify(value)),
  retrieve: (name, defaultValue) =>
    JSON.parse(localStorage[name] ?? JSON.stringify(defaultValue)),
};

/* accessibility.js is generic, but it still addresses the app through a global
 * literally named LARASTELLE. collectorate.js publishes the same small surface
 * rather than edit that shared file; do the same here. The controllers never
 * load together, so the name cannot collide. */
let navNext = null;
let navPrevious = null;
var LARASTELLE = {
  retain: HEALYOURSELF.retain,
  retrieve: HEALYOURSELF.retrieve,
  reveal: { story: () => false },
};

document.addEventListener('DOMContentLoaded', () => {
  buildTracks();
  buildStrips();
  showTrack(0, /* soft */ true);
  bindKeys();
  // Matches the other records: let the frames settle, then swap in the chosen
  // source so every iframe starts detached and cached.
  setTimeout(HEALYOURSELF.init, 100);
});

/* ---------------------------------------------------------------- init -- */

function init() {
  const _ = HEALYOURSELF;
  const params = new URLSearchParams(window.location.search);
  const player = document.querySelector(_.areaPlayer);
  if (!player) return;

  // ?t=N deep-links a track. 1-based in the URL because the track list is.
  const wantTrack = parseInt(params.get(_.params.track), 10);
  if (!isNaN(wantTrack) && hy_tracks[wantTrack - 1]) {
    hy_current = wantTrack - 1;
    showTrack(hy_current, /* soft */ true);
  }
  refreshWatchLinks();

  player.querySelectorAll(':scope > [id]').forEach((frame) => {
    hy_frames.set(frame.getAttribute('id'), frame);
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
  const player = document.querySelector(HEALYOURSELF.areaPlayer);

  document.querySelectorAll('#music-control > *').forEach((s) => {
    s.classList.remove('active');
    s.setAttribute('aria-selected', 'false');
  });
  el.classList.add('active');
  el.setAttribute('aria-selected', 'true');

  const label = document.querySelector('.h-audio-version');
  if (label && el.title) label.textContent = el.title.replace(/^Prefer /, '');

  hy_frames.forEach((frame) => {
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

const hyLoadAPI = (() => {
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

// YT.Player REPLACES its mount element with the iframe, keeping the id — so
// after destroy() there is no #yt_player div left to build into when the viewer
// comes back to this tab. Hand it a fresh div every time.
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
  const track = hy_tracks[hy_current];
  if (id === 'youtube' && track) {
    // Re-entering the tab with a live player would otherwise stack a second one.
    if (yt_player && document.getElementById('yt_player')) return;
    await hyLoadAPI();
    yt_player = new window.YT.Player(freshMount(), {
      videoId: track.videoId,
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
    hy_ready = false;
    document.body.classList.remove('is-playing', 'low-quality');
  }
}

function onPlayerReady() {
  hy_ready = true;
  syncDuration();
  if (hy_pending) {
    const p = hy_pending;
    hy_pending = null;
    goTo(p.index, p.seconds, p.play);
  }
  startTicking();
  paint();
}

function onPlayerState(e) {
  const playing = e.data === window.YT.PlayerState.PLAYING;
  document.body.classList.toggle('is-playing', playing);
  if (playing) startTicking(); else stopTicking();
  // getDuration() reads 0 until the new video's metadata lands, so every state
  // change is the cheapest honest moment to re-ask after a track switch.
  syncDuration();
  // A track that runs out hands off to the next one, so the record plays
  // through the way a single upload would.
  if (e.data === window.YT.PlayerState.ENDED && hy_tracks[hy_current + 1]) {
    goTo(hy_current + 1, 0, true);
  }
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
// played inside an embed. So the column stops pretending it has a player and
// becomes a deep-linked track list instead.
function onPlayerError(e) {
  if (!e || (e.data !== 101 && e.data !== 150)) return;
  document.body.classList.add('embed-blocked');
  stopTicking();
  hy_ready = false;
}

// Real duration once the video is loaded; data-dur is only the poster value
// that keeps the bars honest before then.
function syncDuration() {
  const t = hy_tracks[hy_current];
  const d = safeCall('getDuration', 0);
  if (t && d) t.dur = d;
}

function watchUrl(track, seconds) {
  const t = Math.max(0, Math.floor(seconds || 0));
  return `https://www.youtube.com/watch?v=${track.videoId}`
    + (t ? `&t=${t}s` : '');
}

// The embed-refused note and the "watch on YouTube" affordance both point at
// whichever track is loaded, not at a fixed video.
function refreshWatchLinks() {
  const t = hy_tracks[hy_current];
  if (!t) return;
  document.querySelectorAll('.embed-note a, .watch-out').forEach((a) => {
    a.href = watchUrl(t, 0);
  });
}

function safeCall(method, fallback) {
  if (yt_player && typeof yt_player[method] === 'function') {
    try { return yt_player[method](); } catch (err) { /* torn down */ }
  }
  return fallback;
}

/* --------------------------------------------------------------- model -- */

function buildTracks() {
  const rows = [...document.querySelectorAll('#youtube-chapters .track')];
  hy_tracks = rows.map((row, i) => ({
    row,
    index: i,
    videoId: row.getAttribute('data-video'),
    dur: parseFloat(row.getAttribute('data-dur')) || 0,
    bar: row.querySelector('.track-bar'),
    fill: row.querySelector('.track-fill'),
    clock: row.querySelector('.d'),
    durText: row.querySelector('.d')?.textContent || '',
  }));
  hy_tracks.forEach((t) => { if (t.bar) bindScrub(t); });
}

/* --------------------------------------------------------- transport --- */

function playTrack(el) {
  const row = el.closest('.track');
  const t = hy_tracks.find((x) => x.row === row);
  if (!t) return false;
  // Embed refused: hand the viewer off to YouTube rather than load a player
  // that will never play.
  if (document.body.classList.contains('embed-blocked')) {
    window.open(watchUrl(t, 0), '_blank', 'noopener');
    return false;
  }
  goTo(t.index, 0, true);
  return false;
}

/* The one function collectorate.js has no equivalent of: moving between
 * tracks is a video load, not a seek. Seeking only means anything once the
 * right video is the one in the player. */
function goTo(index, seconds, andPlay) {
  const t = hy_tracks[index];
  if (!t) return;
  const switching = index !== hy_current;
  hy_current = index;

  if (!yt_player || !hy_ready) {
    hy_pending = { index, seconds, play: !!andPlay };
    return;
  }

  if (switching) {
    // paint() zeroes every row that is not hy_current, so the bar we are
    // leaving empties on the next frame without being cleared by hand.
    // load/cueVideoById do NOT fire onReady a second time — that event belongs
    // to the player, not the video — so the new duration is picked up from
    // onPlayerState instead of here.
    if (andPlay && typeof yt_player.loadVideoById === 'function') {
      yt_player.loadVideoById({ videoId: t.videoId, startSeconds: seconds || 0 });
    } else if (typeof yt_player.cueVideoById === 'function') {
      yt_player.cueVideoById({ videoId: t.videoId, startSeconds: seconds || 0 });
    }
  } else {
    if (typeof yt_player.seekTo === 'function') yt_player.seekTo(seconds || 0, true);
    if (andPlay) safeCall('playVideo');
  }

  refreshWatchLinks();
  // Soft: the player turning the page (a row press, or the record running on
  // to the next track) must not yank the viewport out from under the reader.
  // Only the chips scroll, and they call showTrack themselves.
  if (hy_showing !== index) showTrack(index, /* soft */ true);
  paint(seconds || 0);
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
    goTo(t.index, frac * (t.dur || 0), false);
  };

  bar.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    bar.setPointerCapture(e.pointerId);
    hy_scrub = t;
    apply(e);
  });
  bar.addEventListener('pointermove', (e) => { if (hy_scrub === t) apply(e); });
  const release = (e) => {
    if (hy_scrub !== t) return;
    hy_scrub = null;
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
    else if (e.key === 'Home') { e.stopPropagation(); return goTo(t.index, 0, false); }
    else if (e.key === 'End') { e.stopPropagation(); return goTo(t.index, Math.max(0, t.dur - 1), false); }
    else return;
    e.preventDefault();
    e.stopPropagation();   // the anchor bar's own arrows must not also fire
    const here = (t.index === hy_current && hy_ready) ? safeCall('getCurrentTime', 0) : 0;
    goTo(t.index, Math.min(Math.max(0, t.dur - 0.1), Math.max(0, here + delta)), false);
  });
}

/* --------------------------------------------------------------- paint -- */

function startTicking() {
  if (hy_raf) return;
  const loop = () => { paint(); hy_raf = window.requestAnimationFrame(loop); };
  hy_raf = window.requestAnimationFrame(loop);
}

function stopTicking() {
  if (hy_raf) window.cancelAnimationFrame(hy_raf);
  hy_raf = null;
}

function paint(forced) {
  const now = forced !== undefined
    ? forced
    : (hy_ready ? safeCall('getCurrentTime', 0) : 0);

  hy_tracks.forEach((t) => {
    if (hy_scrub === t) return;         // never fight a live drag
    const on = t.index === hy_current;
    // Only the loaded track has a position. Everything else reads as 0, which
    // is the truth: no other video has been started.
    if (!on) drawRow(t, 0);
    else drawRow(t, t.dur > 0 ? Math.min(1, Math.max(0, now / t.dur)) : 0);
    const was = t.row.classList.contains('active');
    t.row.classList.toggle('active', on);
    if (on) t.row.setAttribute('aria-current', 'true');
    else t.row.removeAttribute('aria-current');
    // The row wears its own clock while it plays, so a list cut down to one
    // visible row (the phone layout) still says where the playhead is.
    if (t.clock) {
      const playing = document.body.classList.contains('is-playing');
      t.clock.textContent = (on && playing) ? clock(now) : t.durText;
    }
    if (on && !was) revealRow(t);
  });

  document.querySelectorAll('.elapsed').forEach((el) => {
    el.textContent = clock(now);
  });
}

// Bring the loaded row into the list's window. The list only scrolls on the
// phone layout, where it is one row tall; elsewhere this is a no-op. Never
// scrollIntoView here -- that would also scroll the page, out from under
// whoever is reading.
function revealRow(t) {
  const list = t.row.parentElement;
  if (!list || list.scrollHeight <= list.clientHeight) return;
  list.scrollTop = t.row.offsetTop - list.offsetTop;
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

// Chips go in the anchor bar's .tabs slot. One part per track here, so one
// strip of ten numerals — the grouping hook is kept because the template's
// data-group contract is what buildStrips reads.
function buildStrips() {
  const tabs = document.querySelector('#chapters-control .tabs');
  if (!tabs) return;

  hy_sections = [...document.querySelectorAll('.panels .part')];
  const groups = new Map();
  hy_sections.forEach((part) => {
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
      b.addEventListener('click', () => showTrack(
        parseInt(part.closest('.track-lyrics')?.getAttribute('data-track'), 10) - 1));
      part._chip = b;
      strip.appendChild(b);
    });

    tabs.appendChild(strip);
  });
}

/* One track per panel. The record is ten separate songs with their own
 * lyrics, so a single document that scrolls through all of them reads as one
 * endless page rather than ten tracks; the chip row is the pager. */
function showTrack(index, soft = false) {
  const panels = [...document.querySelectorAll('.panels > [role="tabpanel"]')];
  if (!panels.length || !panels[index]) return false;
  hy_showing = index;

  panels.forEach((panel, i) => {
    const on = i === index;
    panel.style.display = on ? 'block' : 'none';
    if (on) panel.removeAttribute('inert');
    else panel.setAttribute('inert', 'true');
  });

  hy_sections.forEach((part) => {
    const owner = parseInt(part.closest('.track-lyrics')?.getAttribute('data-track'), 10) - 1;
    const on = owner === index;
    part.classList.toggle('in-view', on);
    if (part._chip) {
      part._chip.classList.toggle('active', on);
      part._chip.setAttribute('aria-current', on ? 'true' : 'false');
    }
  });

  const head = document.querySelector('.h-text-version');
  const title = panels[index].getAttribute('aria-label');
  if (head && title) head.textContent = title;

  // Paging should bring you back to the top of the new track — but not on the
  // first call, which runs at load and would scroll the banner off screen
  // before the viewer has done anything.
  if (!soft) {
    const top = document.querySelector('#scroll-top');
    if (top) top.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  return false;
}


/* ---------------------------------------------------------------- keys -- */

function bindKeys() {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (e.target.closest && e.target.closest('.track-bar')) return;
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showTrack(Math.max(0, hy_showing - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showTrack(Math.min(hy_tracks.length - 1, hy_showing + 1));
    }
  });
}
