/* SCROLLER — the Larastelle chapter scroller, canonized.
 *
 * LARASTELLE's chapter row is the strongest piece of navigation on the site:
 * one tightly packed glyph per chapter with no margin or padding at all, a
 * band of colour sliding along the row to mark where you are, previous/next
 * on either end, and a window that narrows on smaller screens so an arbitrary
 * number of chapters still fits (chapters further than N steps from the
 * current one are hidden -- .distance-N classes, decided by css/scroller.css).
 * The middle segments are a convenience; previous/next is the mechanism.
 *
 * This is that component lifted out so the album pagers can use it. Nothing
 * here knows about tracks, panels or players: the caller hands over a list of
 * items and a pick(index) callback and gets back select(index) to move the
 * band. Same shape as the other controllers: one global UPPERCASE object, no
 * modules, wired by <script> order.
 *
 * larastelle.html still runs its own copy inline -- its glyphs are the
 * ChapterFont punctuation chosen per chapter, and its next button previews the
 * coming chapter's name. That is the origin, not a fork; migrating it is a
 * separate decision.
 *
 *   SCROLLER.build(nav, [{ label, glyph?, id?, className?, gap? }], { pick })
 *     nav      the <nav id="chapters-control"> whose .tabs slot to fill
 *     label    accessible name of the item (title attribute, aria-label)
 *     glyph    what to draw; defaults to a heavy dot -- the point is a tappable
 *              mark, not a comfy target
 *     id       aria-controls target
 *     gap      true to draw a separator before this item
 *     pick(i)  called when an item, previous or next is chosen
 *
 *   returns { select(i), active(), els }
 */

/* var, not const: these pages are classic scripts wired by <script> order and
 * address each other through window, the way LARASTELLE is addressed. A
 * top-level const would not be reachable that way. */
var SCROLLER = {
  build: buildScroller,
  glyph: '●',     // ● heavy dot
};

function buildScroller(nav, items, { pick } = {}) {
  const tabs = nav && nav.querySelector('.tabs');
  if (!tabs || !items || !items.length) return null;

  tabs.classList.add('scroller');
  tabs.textContent = '';
  nav.querySelectorAll(':scope > .nav-previous, :scope > .nav-next').forEach((a) => a.remove());

  const els = [];
  let current = -1;

  const choose = (i) => {
    if (i < 0 || i >= items.length) return false;
    if (pick) pick(i);
    else select(i);
    return false;
  };

  items.forEach((item, i) => {
    if (item.gap && i > 0) {
      const sep = document.createElement('span');
      sep.setAttribute('role', 'presentation');
      sep.textContent = '|';
      tabs.appendChild(sep);
    }
    const a = document.createElement('a');
    a.setAttribute('role', 'listitem');
    a.setAttribute('href', '#' + (item.id || ''));
    if (item.id) a.setAttribute('aria-controls', item.id);
    a.setAttribute('aria-label', item.label || `${i + 1}`);
    a.title = item.label || '';
    if (item.className) a.className = item.className;
    const mark = document.createElement('span');
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = item.glyph || SCROLLER.glyph;
    a.appendChild(mark);
    a.addEventListener('click', (e) => { e.preventDefault(); choose(i); });
    tabs.appendChild(a);
    els.push(a);
  });

  const prev = document.createElement('a');
  prev.className = 'nav-previous';
  prev.setAttribute('href', '#');
  prev.setAttribute('aria-label', 'Previous');
  prev.addEventListener('click', (e) => { e.preventDefault(); choose(current - 1); });
  const next = document.createElement('a');
  next.className = 'nav-next';
  next.setAttribute('href', '#');
  next.setAttribute('aria-label', 'Next');
  next.addEventListener('click', (e) => { e.preventDefault(); choose(current + 1); });
  nav.insertBefore(prev, tabs);
  nav.appendChild(next);

  // The band is one gradient laid along the whole row; each active segment
  // shows the slice under it, so the colour reads as position, not paint.
  function paintBand() {
    const width = tabs.offsetWidth;
    const left = tabs.getBoundingClientRect().left;
    els.forEach((a) => {
      a.style.backgroundSize = `${width}px 100%`;
      a.style.backgroundPosition = `-${a.getBoundingClientRect().left - left}px 0%`;
    });
  }

  function select(i) {
    if (i < 0 || i >= items.length) return;
    current = i;
    els.forEach((a, j) => {
      const distance = Math.abs(j - i);
      [...a.classList].forEach((c) => { if (/^distance-\d+$/.test(c)) a.classList.remove(c); });
      a.classList.add(`distance-${Math.min(distance, 20)}`);
      a.classList.toggle('active', j === i);
      if (j === i) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    prev.classList.toggle('at-end', i === 0);
    next.classList.toggle('at-end', i === items.length - 1);
    prev.title = i > 0 ? (items[i - 1].label || '') : '';
    next.title = i < items.length - 1 ? (items[i + 1].label || '') : '';
    // Hidden segments change the row's width, so the band is laid out after
    // the distance classes settle.
    requestAnimationFrame(paintBand);
  }

  if (window.ResizeObserver) new ResizeObserver(() => paintBand()).observe(tabs);
  else window.addEventListener('resize', paintBand);

  // Expose the ends to accessibility.js's swipe pager, which addresses them
  // through these globals.
  if (typeof navNext !== 'undefined') { navNext = next; navPrevious = prev; }

  return { select, active: () => current, els, prev, next };
}
