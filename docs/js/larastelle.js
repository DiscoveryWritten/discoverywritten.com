let useFocus = false;
let useColorAnimation = true;
let useSwiping = true;
let useDark = false;

// let gradient;
// let storyScroller = null;
const iframeCache = new Map();
let navNext = null;
let navPrevious = null;

document.addEventListener('keydown', (e) => {
  const doc = document.querySelector('.panels > div[aria-hidden="false"]');
});

document.addEventListener('DOMContentLoaded', () => {
  navNext = document.querySelector('.nav-next');
  navPrevious = document.querySelector('.nav-previous');
  // Bind scroll events for chapter timeline
  // storyScroller = document.getElementById('chapters-control');
  // storyScroller.addEventListener('wheel', onScroll, { passive: false });
  accessFocus(useFocus);
  accessAnimation(useColorAnimation);
  accessDark(useDark);

  // Bind keys
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      navNext.click();
    } else if (e.key === 'ArrowLeft') {
      navPrevious.click();
    }
  });

  // Configure accessibility pop-up
  const accessBtn = document.getElementById('filter-toggle');
  accessBtn.addEventListener('click', () => {
    const expanded = accessBtn.getAttribute('aria-expanded') === 'true';
    const form = document.getElementById('filter-panel');
    accessBtn.setAttribute('aria-expanded', String(!expanded));
    form.hidden = expanded;
    if (useFocus) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Build chapter gradient positions
  const row = document.querySelector('#chapters-control .tabs');
  const links = row.querySelectorAll(':scope > a');
  const totalWidth = row.offsetWidth;
  links.forEach((link) => {
    const linkLeft = link.getBoundingClientRect().left;
    const relativeLeft = linkLeft - row.getBoundingClientRect().left;;
    link.style.backgroundSize = `${totalWidth}px 100%`;
    link.style.backgroundPosition = `-${relativeLeft}px 0%`;
  });

  // Enable wheel scroller
  rebake(document.querySelector('#chapters-control .tabs'));

  // Set active chapter
  const params = new URLSearchParams(window.location.search);
  setTimeout(() => {
    album(null, params.get('ch') || 0, true);
  }, 100);

  // Set active Source
  const player = document.querySelector('.player');
  const active = document.querySelector('#music-control .active');
  const iframes = player.querySelectorAll(':scope > [id]');
  iframes.forEach((iframe) => {
    const id = iframe.getAttribute('id');
    iframeCache.set(id, iframe);
    if (id !== active.getAttribute('data-iframe')) {
      iframe.style.display = 'none';
      // console.log(id, active.getAttribute('data-iframe'), iframe);
      iframe.remove();
    } else {
      const player = document.querySelector('.player');
      player.setAttribute('data-source', id);
      source(active, true);
    }
  });
});

// Youtube player init
let yt_player;
const _loadYouTubeAPI = (() => {
  let promise;
  return () => {
    if (promise) return promise;
    promise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve();
      window.onYouTubeIframeAPIReady = () => resolve();
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
    return promise;
  };
})();

function _prepYTPlayer(id) {
  if (id === 'youtube') {
    _loadYouTubeAPI().then(() => {
      yt_player = new window.YT.Player('yt_player', {
        videoId: 'CVb1oR5DnHM',
        events: {},
      });
    })
  } else {
    if (yt_player && typeof yt_player.destroy === 'function') {
      yt_player.destroy();
      yt_player = null;
    }
  }
}

function seek(el) {
  const ts = el.getAttribute('data-ts');
  if (yt_player && typeof yt_player.seekTo === 'function') {
    yt_player.seekTo(ts, true);
  }
  return false;
}

function source(el, soft = false) {
  const id = el.getAttribute('data-iframe');

  const sources = document.querySelectorAll('#music-control > *');
  sources.forEach((s) => {
    s.classList.remove('active');
    s.setAttribute('aria-selected', 'false');
  });
  el.classList.add('active');
  el.setAttribute('aria-selected', 'true');
  // if el is a button, we want to kthe aria-label
  if (el.tagName === 'BUTTON') {
    document.querySelector('.h-audio-version').textContent = el.title.split(' ', 2)[1];
  }

  iframeCache.forEach((iframe) => {
    const thisId = iframe.getAttribute('id');
    if (thisId === id) {
      iframe.style.display = 'block';
      const player = document.querySelector('.player');
      player.setAttribute('data-source', id);
      player.appendChild(iframe);
      player.scrollTop = 0;
      _prepYTPlayer(id);
      if (!soft) {
        iframe.focus();
      }
    } else {
      iframe.style.display = 'none';
      iframe.remove();
    }
  });

  return false;
}

function album(el, ch, softFocus = null) {
  const soft = softFocus || !useFocus;
  let implied = null;
  const panels = document.querySelectorAll('.panels > div');
  const tabs = [...document.querySelectorAll('.tabs a')];

  panels.forEach((panel) => {
    panel.style.display = "none";
    panel.setAttribute('inert', true);
    unbake(panel);
  });

  if (el?.hasAttribute('data-last')) {
    ch = 1;
    implied = tabs[ch];
    console.log(el, ch, implied);
  } else if (ch === undefined) {
    ch = tabs.findIndex((tab) => tab.classList.contains('active'));

    if (el.previousElementSibling === null) {
      ch = ch - 1;
      ch = Math.max(ch, 0);
    } else if (el.nextElementSibling === null) {
      ch = ch + 1;
      ch = Math.min(ch, panels.length - 1);
    }
    implied = tabs[ch];
  }

  // Annotate each chapter segment with its absolute value distance
  // from the current selection. @media queries decide which distance
  // is allowed to display.
  tabs.forEach((tab, i) => {
    const distance = Math.abs(i - ch);
    const clamped = Math.min(distance, tabs.length);
    for (const cls of [...tab.classList]) {
      if (/^distance-\d+$/.test(cls)) {
        tab.classList.remove(cls);
      }
    }
    tab.classList.remove('active');
    tab.classList.add(`distance-${clamped}`);
    tab.removeAttribute('aria-selected');
    tab.removeAttribute('innert');
  });

  if (el === null && implied === null) {
    implied = tabs[ch];
  }
  // console.log('-', ch, tabs[ch]);

  const finalEl = implied || el;
  finalEl.classList.add('active');
  finalEl.setAttribute('aria-selected', 'true');
  document.querySelector('.h-text-version').textContent = finalEl.getAttribute('aria-label');
  if (finalEl.nextElementSibling) {
    const preview = (
      finalEl.nextElementSibling.getAttribute('aria-label')
      || finalEl.nextElementSibling.nextElementSibling.getAttribute('aria-label')
    );
    document.querySelector('#next').removeAttribute('data-last');
    document.querySelector('#next').textContent = `Next: ${preview}`;
  } else {
    document.querySelector('#next').setAttribute('data-last', true);
    document.querySelector('#next').textContent = 'Repeat';
  }
  if (panels[ch] !== undefined) {
    panels[ch].style.display = 'block';
    panels[ch].removeAttribute('inert');
    // panels[ch].setAttribute('aria-hidden', 'false');
    if (!soft) {
      panels[ch].querySelector('[role=document]').focus({ preventScroll: true });
      document.querySelector('.h-text-version').scrollIntoView({ behavior: 'smooth' });
    }
  }

  rebake(panels[ch]);

  return false;
}

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
  if (stopTimer) {
    clearTimeout(stopTimer);
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
    album(navNext);
  } else if (deltaX < 0 || startX < 0) {
    album(navPrevious);
  }
});
function prevent(e) { e.preventDefault(); }
function unbake(doc) {
  if (doc === null) {
    return;
  }
  doc.removeEventListener('wheel', pageStart);
  doc.removeEventListener('touchmove', prevent, { passive: false });
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
  doc.addEventListener('touchmove', prevent, { passive: false });
  doc.addEventListener('touchstart', pageStart, { passive: false });
  doc.addEventListener('touchend', pageEnd);
  // doc.addEventListener('mousedown', pageStart);
  // doc.addEventListener('mouseup', pageEnd);
}

// screen-reader function for busy iframes
// function togglePlayer(on=true) {
//   document.querySelector('player').setAttribute('aria-hidden', !on);
//   document.getElementById('music-show').hidden = on;
//   document.getElementById('music-hide').hidden = !on;
// }
function accessFocus(on=true) {
  useFocus = on || false;
  return true;
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
  return true;
}
function accessDark(on=true) {
  useDark= on;
  document.querySelector("body").classList.toggle('dark', on);
  return true;
}


// const scrollUnit = 10; // tune this later
// let scrollX = 0;
// let targetStep = 0;
// let lastEmittedStep = 0;
let stopTimer = null;
// let maxAbsDelta = 1;
// let sensitivity = .25;

// function onScroll(e) {
//   e.preventDefault();
//   e.stopPropagation();
//   const itemCount = storyScroller.querySelectorAll('.tabs > a').length;

//   const delta = e.deltaY || e.deltaX;
//   maxAbsDelta = Math.max(maxAbsDelta, Math.abs(delta));
//   const normalized = delta / maxAbsDelta;
//   scrollX += normalized;

//   const maxScroll = (itemCount - 1) * scrollUnit;
//   scrollX = Math.max(0, Math.min(scrollX, maxScroll));
//   console.log(maxAbsDelta, scrollX);

//   if (Math.abs(scrollX) >= sensitivity) {
//     const stepDirection = Math.sign(scrollX);
//     scrollX = 0; // reset after emit
//     handleStepChange(stepDirection);
//   }

//   clearTimeout(stopTimer);
//   stopTimer = setTimeout(() => {
//     targetStep = Math.round(scrollX / scrollUnit);
//     scrollX = targetStep * scrollUnit;
//     handleStepChange(targetStep); // optional: emit again if rounding changed
//   }, 100); // short pause = scroll stopped
// }

// function handleStepChange(step) {
//   console.log('Moved to step:', step);
//   // Move carousel, highlight, etc.
// }
