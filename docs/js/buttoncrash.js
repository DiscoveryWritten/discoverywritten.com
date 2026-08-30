/* BUTTONCRASH — controller for the Button Crash exhibit.
 *
 * Same shape as COLLECTORATE, LARASTELLE and HEALYOURSELF: one global
 * UPPERCASE object, no modules, wired by <script> order, initialized on
 * DOMContentLoaded. Same template — the sticky .pair.links anchor bar,
 * .music-story's player-left / story-right, one panel per track.
 *
 * Two things make this record its own controller rather than a page of one of
 * the others:
 *
 * 1. It is on SOUNDCLOUD, so there is no YouTube iframe API here at all.
 *    SoundCloud ships its own widget API, which is a different object with a
 *    different contract: SC.Widget(iframe).load(url, opts) swaps the track,
 *    and position/duration arrive through events rather than being polled off
 *    a player handle.
 *
 * 2. The pager is the word CRASH. Every track is named for its letter, in
 *    order, so the chips are letters and the letter IS the track number. The
 *    row is built from the DOM rather than generated, because which letter
 *    belongs to which track is a fact about the record, not a loop index.
 *
 * Not every track streams: Second Chances is not on SoundCloud at all. That is
 * a property of a row — data-sc absent — and the controller is built to show it
 * honestly, paging to the panel without offering audio it cannot deliver,
 * rather than pretending the letter is dead. (Had I The Time is 1:08 by
 * design, not by truncation, so it is an ordinary streamable row.)
 */

let bc_widget = null;
let bc_ready = false;
let bc_current = -1;      // index of the track loaded in the widget, -1 = none
let bc_showing = 0;       // index of the panel on screen
let bc_tracks = [];

const BUTTONCRASH = {
  areaPlayer: '.player',
  params: { track: 't' },

  init,

  retain: (name, value) => localStorage[name] ??
    (localStorage[name] = JSON.stringify(value)),
  retrieve: (name, defaultValue) =>
    JSON.parse(localStorage[name] ?? JSON.stringify(defaultValue)),
};

/* accessibility.js addresses the app through a global literally named
 * LARASTELLE. Publish the same small surface rather than edit that shared
 * file; the controllers never load together, so the name cannot collide. */
let navNext = null;
let navPrevious = null;
var LARASTELLE = {
  retain: BUTTONCRASH.retain,
  retrieve: BUTTONCRASH.retrieve,
  reveal: { story: () => false },
};

document.addEventListener('DOMContentLoaded', () => {
  buildTracks();
  buildLetters();
  showTrack(0, /* soft */ true);
  bindKeys();
  setTimeout(BUTTONCRASH.init, 100);
});

/* ---------------------------------------------------------------- init -- */

function init() {
  const params = new URLSearchParams(window.location.search);
  const want = parseInt(params.get(BUTTONCRASH.params.track), 10);
  if (!isNaN(want) && bc_tracks[want - 1]) showTrack(want - 1, /* soft */ true);
  prepWidget();
}

function buildTracks() {
  bc_tracks = [...document.querySelectorAll('#sc-tracks .track')].map((row, i) => ({
    row,
    index: i,
    letter: row.getAttribute('data-letter'),
    scId: row.getAttribute('data-sc') || null,
    dur: parseFloat(row.getAttribute('data-dur')) || 0,
    bar: row.querySelector('.track-bar'),
    fill: row.querySelector('.track-fill'),
  }));
}

/* -------------------------------------------------------------- widget -- */

function prepWidget() {
  const frame = document.getElementById('sc_player');
  if (!frame || !window.SC || !window.SC.Widget) return;
  bc_widget = window.SC.Widget(frame);

  bc_widget.bind(window.SC.Widget.Events.READY, () => {
    bc_ready = true;
    // The iframe is authored pointing at the first streamable track, so that
    // is what is loaded before anyone clicks anything.
    if (bc_current < 0) bc_current = bc_tracks.findIndex((t) => t.scId);
    paint(0);
  });

  bc_widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e) => {
    paint((e && e.currentPosition ? e.currentPosition : 0) / 1000);
  });

  bc_widget.bind(window.SC.Widget.Events.PLAY, () => {
    document.body.classList.add('is-playing');
  });

  bc_widget.bind(window.SC.Widget.Events.PAUSE, () => {
    document.body.classList.remove('is-playing');
  });

  // Run the record on: the next streamable track, skipping the gaps.
  bc_widget.bind(window.SC.Widget.Events.FINISH, () => {
    document.body.classList.remove('is-playing');
    const next = bc_tracks.find((t) => t.index > bc_current && t.scId);
    if (next) playIndex(next.index, true);
  });
}

/* Load a track into the widget. Only meaningful for a row that has one. */
function playIndex(index, andPlay) {
  const t = bc_tracks[index];
  if (!t) return false;
  showTrack(index);
  if (!t.scId) return false;                  // nothing to stream; panel still moves
  if (!bc_widget || !bc_ready) return false;

  if (index !== bc_current) {
    bc_current = index;
    bc_widget.load(`https://api.soundcloud.com/tracks/${t.scId}`, {
      auto_play: !!andPlay,
      show_comments: false,
      hide_related: true,
      show_reposts: false,
      show_teaser: false,
      color: 'c0356f',
    });
  } else if (andPlay) {
    bc_widget.seekTo(0);
    bc_widget.play();
  }
  return false;
}

function playTrack(el) {
  const row = el.closest('.track');
  const t = bc_tracks.find((x) => x.row === row);
  if (!t) return false;
  if (!t.scId) { showTrack(t.index); return false; }
  return playIndex(t.index, true);
}

/* ------------------------------------------------------- letters/pager -- */

/* The chips are the letters of CRASH, taken off the rows rather than
 * generated, because the letter is a fact about the track. */
function buildLetters() {
  const tabs = document.querySelector('#chapters-control .tabs');
  if (!tabs) return;
  const strip = document.createElement('div');
  strip.className = 'strip letters';
  strip.setAttribute('role', 'list');

  bc_tracks.forEach((t) => {
    const b = document.createElement('button');
    b.className = 'chip letter';
    b.setAttribute('role', 'listitem');
    b.setAttribute('aria-controls', `tr${t.index + 1}`);
    b.textContent = t.letter;
    const title = t.row.querySelector('.t')?.textContent || '';
    b.title = `${t.letter} — ${title}`;
    b.setAttribute('aria-label', `${t.letter}: ${title}`);
    if (!t.scId) b.classList.add('silent');
    b.addEventListener('click', () => showTrack(t.index));
    t.chip = b;
    strip.appendChild(b);
  });

  tabs.appendChild(strip);
}

function showTrack(index, soft = false) {
  const panels = [...document.querySelectorAll('.panels > [role="tabpanel"]')];
  if (!panels[index]) return false;
  bc_showing = index;

  panels.forEach((panel, i) => {
    const on = i === index;
    panel.style.display = on ? 'block' : 'none';
    if (on) panel.removeAttribute('inert');
    else panel.setAttribute('inert', 'true');
  });

  bc_tracks.forEach((t) => {
    if (!t.chip) return;
    const on = t.index === index;
    t.chip.classList.toggle('active', on);
    t.chip.setAttribute('aria-current', on ? 'true' : 'false');
  });

  const head = document.querySelector('.h-text-version');
  const title = panels[index].getAttribute('aria-label');
  if (head && title) head.textContent = title;

  if (!soft) {
    const top = document.querySelector('#scroll-top');
    if (top) top.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  return false;
}

/* --------------------------------------------------------------- paint -- */

function paint(seconds) {
  bc_tracks.forEach((t) => {
    const on = t.index === bc_current;
    const frac = (on && t.dur > 0) ? Math.min(1, Math.max(0, seconds / t.dur)) : 0;
    if (t.fill) t.fill.style.transform = `scaleX(${frac})`;
    if (t.bar) t.bar.setAttribute('aria-valuenow', Math.round(frac * 100));
    t.row.classList.toggle('active', on);
    if (on) t.row.setAttribute('aria-current', 'true');
    else t.row.removeAttribute('aria-current');
  });
  document.querySelectorAll('.elapsed').forEach((el) => {
    el.textContent = clock(seconds);
  });
}

function clock(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* ---------------------------------------------------------------- keys -- */

function bindKeys() {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showTrack(Math.max(0, bc_showing - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showTrack(Math.min(bc_tracks.length - 1, bc_showing + 1));
    }
  });
}
