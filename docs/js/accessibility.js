// Switches
let usePlayer = true;
let useFocus = false;
let useAnimation = true;
let useSwiping = false;
let useDark = false;
let gestureFeedbackTimeout = null;

// General toggling observer fires one callback per state
function when(el, test, t = (() => {}), f = (() => {})) {
  const context = {
    observer: null,
    test: () => test(el),
  }
  function flip(o) {
    t();
    if (o) {
      o.disconnect();
    }
    const { observer } = when(el, (el) => !test(el), f, t);
    return observer;
  }

  if (test(el)) {
    context.observer = flip(context.observer);
    return context;
  }

  context.observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.attributeName === 'class' && test(el)) {
        context.observer = flip(context.observer);
      }
    }
  });
  context.observer.observe(el, {
      attributes: true,
      attributeFilter: ['class'],
  });
  return context;
}
// _.swiping.hook(document.querySelector(_.swiping.timelineSelector));

const ACCESSIBILITY = {
  buttonId: 'filter-toggle',
  panelId: 'filter-panel',
  access: {
    player: accessPlayer,
    focus: accessFocus,
    swiping: accessSwiping,
    animation: accessAnimation,
    dark: accessDark,
  },
  when: {
    animation: (on, off) => when(
      document.querySelector('body'),
      (el) => !el.classList.contains('no-animation'),
      on, off),
    dark: (on, off) => when(
      document.querySelector('body'),
      (el) => el.classList.contains('dark'),
      on, off),
  },
  swiping: {
    start: swipeStart,
    end: swipeEnd,
    hook: swipeEnable,
    unhook: swipeDisable,
    timelineSelector: '#chapters-control .tabs',
  },
  focus: {
    text: focusText,
  }
};

(() => {
  const _ = ACCESSIBILITY;

  document.addEventListener('DOMContentLoaded', () => {
    const load = LARASTELLE.retrieve;
    accessPlayer(load('usePlayer', usePlayer));
    accessFocus(load('useFocus', useFocus));
    accessAnimation(load('useAnimation', useAnimation));
    accessDark(load('useDark', useDark));
    accessSwiping(load('useSwiping', useSwiping));

    const button = document.getElementById(_.buttonId);
    button.addEventListener('click', showAccessibility(button));

    // Sticky header conditions detector
    const sentinel = document.querySelector('#scroll-top');
    const body = document.querySelector('body');
    new IntersectionObserver(([entry]) => {
      body.classList.toggle('is-floating', !entry.isIntersecting);
    }).observe(sentinel);
  });

  function showAccessibility(button) {
    return () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const form = document.getElementById(_.panelId);
      button.setAttribute('aria-expanded', String(!expanded));
      form.hidden = expanded;
    }
  }
})();

// Accessibility: Mutations
function accessPlayer(on=true) {
  usePlayer = LARASTELLE.retain('usePlayer', on);;
  document.querySelector('.player').setAttribute('inert', !on);
}
function accessFocus(on=true) {
  useFocus = LARASTELLE.retain('useFocus', on);
}
function accessSwiping(on=true) {
  useSwiping = LARASTELLE.retain('useSwiping', on);
  const doc = document.getElementById(
    document
      .querySelector(`${ACCESSIBILITY.swiping.timelineSelector} .active`)
      .getAttribute('aria-controls')
  );
  let op = on ? swipeEnable : swipeDisable;
  op(doc);
  op(document.querySelector(ACCESSIBILITY.swiping.timelineSelector));
}
function accessAnimation(on=true, { soft=false }={}) {
  useAnimation = soft ? on : LARASTELLE.retain('useAnimation', on);
  document.querySelector('body').classList.toggle('no-animation', !on);
}
function accessDark(on=true) {
  useDark = LARASTELLE.retain('useDark', on);
  document.querySelector('body').classList.toggle('dark', on);
}

function checkSwipe(e) {
  const endX = e.deltaX || (e.changedTouches?.[0] || e).clientX;
  const deltaX = endX - startX;
  // const deltaT = Date.now() - startTime;
  // startTime = 0;  // reset

  if (deltaX > 0 || startX > 0) {
    LARASTELLE.reveal.story(navNext);
  } else if (deltaX < 0 || startX < 0) {
    LARASTELLE.reveal.story(navPrevious);
  }
}

// Accessibility: Horizontal swiping gestures
let startX = 0;
// let startTime = 0;
function throttle(fn, delay = 50) {
  let blocked = false;
  return function(e) {
    if (blocked) return;
    blocked = true;
    fn(e);
    setTimeout(() => blocked = false, delay);
  };
}
function swipeStart(e, gestureFeedback = 1000) {
  if (e.deltaY && !e.deltaX) {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  if (gestureFeedbackTimeout) {
    clearTimeout(gestureFeedbackTimeout);
  }
  document.querySelector('.story').classList.add('gesture-feedback');
  setTimeout(() => {
    document.querySelector('.story').classList.remove('gesture-feedback');
  }, gestureFeedback);
  if (e.deltaX && !e.deltaY) {
    startX = e.deltaX;
    ACCESSIBILITY.swiping.end(e);
  } else {
    startX = (e.touches?.[0] || e).clientX;
  }
  // startTime = Date.now();
}
function swipeEnd(...args) {
  return throttle(checkSwipe)(...args);
}

function swipePreventDefault(e) { e.preventDefault(); }

function swipeDisable(doc) {
  if (doc === null) {
    return;
  }
  doc.removeEventListener('wheel', ACCESSIBILITY.swiping.start);
  doc.removeEventListener('touchmove', swipePreventDefault, { passive: false });
  doc.removeEventListener('touchstart', ACCESSIBILITY.swiping.start, { passive: false });
  doc.removeEventListener('touchend', ACCESSIBILITY.swiping.end);
  // doc.removeEventListener('mousedown', ACCESSIBILITY.swiping.start);
  // doc.removeEventListener('mouseup', ACCESSIBILITY.swiping.end);

}
function swipeEnable(doc) {
  if (!useSwiping) {
    return;
  }
  // _.swiping.hook(document.querySelector(_.swiping.timelineSelector));
  doc.addEventListener('wheel', ACCESSIBILITY.swiping.start);
  doc.addEventListener('touchmove', swipePreventDefault, { passive: false });
  doc.addEventListener('touchstart', ACCESSIBILITY.swiping.start, { passive: false });
  doc.addEventListener('touchend', ACCESSIBILITY.swiping.end);
  // doc.addEventListener('mousedown', ACCESSIBILITY.swiping.start);
  // doc.addEventListener('mouseup', ACCESSIBILITY.swiping.end);
}

// focus
function focusText() {
  const tab = document.querySelector('.tabs a[aria-selected="true"]');
  const panel = document.getElementById(tab.getAttribute('aria-controls'));

  if (useFocus) {
    panel.querySelector('[role=document]').focus({ preventScroll: true });
  }
  document.querySelector('.h-text-version').scrollIntoView({ behavior: 'smooth' });
}
