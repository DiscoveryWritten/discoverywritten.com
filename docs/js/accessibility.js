// Switches
let usePlayer = true;
let useFocus = false;
let useColorAnimation = true;
let useSwiping = true;
let useDark = false;
let gestureFeedbackTimeout = null;

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
    dark: (on, off) => whenDark(
      document.querySelector('body'),
      on, off,
      (el) => el.classList.contains('dark')),
  },
  swiping: {
    hook: rebake,
    unhook: unbake,
    timelineSelector: '#chapters-control .tabs',
  },
};

(() => {
  const _ = ACCESSIBILITY;

  document.addEventListener('DOMContentLoaded', () => {
    accessFocus(useFocus);
    accessAnimation(useColorAnimation);
    accessDark(useDark);

    _.swiping.hook(document.querySelector(_.swiping.timelineSelector));

    const button = document.getElementById(_.buttonId);
    button.addEventListener('click', showAccessibility(button));
  });

  function showAccessibility(button) {
    return () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const form = document.getElementById(_.panelId);
      button.setAttribute('aria-expanded', String(!expanded));
      form.hidden = expanded;
      if (useFocus) {
        form.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
})();

// Accessibility: Mutations
function accessPlayer(on=true) {
  usePlayer = on || false;
  document.querySelector('player').setAttribute('inert', !on);
}
function accessFocus(on=true) {
  useFocus = on || false;
}
function accessSwiping(on=true) {
  useSwiping = on || false;
  const doc = document.getElementById(
    document
      .querySelector('#chapters-control .tabs .active')
      .getAttribute('aria-controls')
  );
  if (on) {
    rebake(doc);
    rebake(document.querySelector('#chapters-control .tabs'));
  } else {
    unbake(doc);
    unbake(document.querySelector('#chapters-control .tabs'));
  }
}
function accessAnimation(on=true) {
  useColorAnimation = on;
  document.querySelectorAll(".penrose-font, #chapters-control > a").forEach((el) => {
    if (!on && !el.classList.contains('no-animation')) {
      el.classList.add('no-animation');
    } else {
      el.classList.remove('no-animation');
    }
  });
}
function accessDark(on=true) {
  useDark = on;
  document.querySelector('body').classList.toggle('dark', on);
}

// Accessibility: Dark
function whenDark(el, on, off, test) {
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.attributeName === 'class' && test(el)) {
        on();
        observer.disconnect();
        whenDark(el, off, on, (el) => !test(el));
      }
    }
  });
  observer.observe(el, {
      attributes: true,
      attributeFilter: ['class'],
  });
}

// Accessibility: Horizontal swiping gestures
let startX = 0;
let startTime = 0;
function throttle(fn, delay = 50) {
  let blocked = false;
  return function(e) {
    if (blocked) return;
    blocked = true;
    fn(e);
    setTimeout(() => blocked = false, delay);
  };
}
function pageStart(e) {
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
  }, 1000);
  if (e.deltaX && !e.deltaY) {
    startX = e.deltaX;
    pageEnd(e);
  } else {
    startX = (e.touches?.[0] || e).clientX;
  }
  startTime = Date.now();
}
const pageEnd = throttle(function pageEnd(e) {
  const endX = e.deltaX || (e.changedTouches?.[0] || e).clientX;
  const deltaX = endX - startX;
  // const deltaT = Date.now() - startTime;
  startTime = 0;

  if (deltaX > 0 || startX > 0) {
    LARASTELLE.reveal.story(navNext);
  } else if (deltaX < 0 || startX < 0) {
    LARASTELLE.reveal.story(navPrevious);
  }
});

function pagePrevent(e) { e.preventDefault(); }

function unbake(doc) {
  if (doc === null) {
    return;
  }
  doc.removeEventListener('wheel', pageStart);
  doc.removeEventListener('touchmove', pagePrevent, { passive: false });
  doc.removeEventListener('touchstart', pageStart, { passive: false });
  doc.removeEventListener('touchend', pageEnd);
  // doc.removeEventListener('mousedown', pageStart);
  // doc.removeEventListener('mouseup', pageEnd);

}
function rebake(doc) {
  if (!useSwiping) {
    return;
  }
  doc.addEventListener('wheel', pageStart);
  doc.addEventListener('touchmove', pagePrevent, { passive: false });
  doc.addEventListener('touchstart', pageStart, { passive: false });
  doc.addEventListener('touchend', pageEnd);
  // doc.addEventListener('mousedown', pageStart);
  // doc.addEventListener('mouseup', pageEnd);
}
