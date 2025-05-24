let navNext = null;
let navPrevious = null;
let player = null;
let next = null;
const iframeCache = new Map();

const LARASTELLE = {
  areaPlayer: '.player',
  defaultMusic: 'spotify',
  navGeneralNext: '#next',
  navNext: '.nav-next',
  navPrevious: '.nav-previous',
  keys: {
    next: 'ArrowRight',
    previous: 'ArrowLeft',
  },
  params: {
    story: 'ch',
    music: 's',
  },
  init,
  reveal: {
    music: source,
    story: album,
  }
};

(function(){
  const _ = LARASTELLE;
  document.addEventListener('DOMContentLoaded', () => {
    next = document.querySelector(_.navGeneralNext);
    navNext = document.querySelector(_.navNext);
    navPrevious = document.querySelector(_.navPrevious);
    player = document.querySelector(_.areaPlayer);

    // Bind keys
    document.addEventListener('keydown', (e) => {
      if (e.key === _.keys.next) {
        navNext.click();
      } else if (e.key === _.keys.previous) {
        navPrevious.click();
      }
    });

    // Prepare story timeline
    buildTimelineGradient();

    // Configure default area with URL params.
    // This ensures iframes are unloaded and cached away.
    setTimeout(_.init, 100);
  });
})();


function init() {
  const _ = LARASTELLE;
  const params = new URLSearchParams(window.location.search);

  // Set active story chapter from url params
  _.reveal.story(null, /* index */ params.get(_.params.story) || 0, /* soft */ true);

  // Set active music source
  const source = params.get(_.params.music) || _.defaultMusic;
  player.querySelectorAll(':scope > [id]').forEach((iframe) => {
    const id = iframe.getAttribute('id');
    iframeCache.set(id, iframe);
    iframe.style.display = 'none';
    iframe.remove();
  });
  player.setAttribute('data-source', source);
  const btn = document.querySelector(`#music-control [data-iframe="${source}"]`);
  _.reveal.music(btn, /* soft */ true);
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

function album(el, ch, softFocus = null, noRing = false) {
  const soft = softFocus === null ? !useFocus : softFocus;
  let implied = null;
  const panels = document.querySelectorAll('.panels > div');
  const tabs = [...document.querySelectorAll('.tabs a')];

  panels.forEach((panel) => {
    panel.style.display = "none";
    panel.setAttribute('inert', true);
    ACCESSIBILITY.swiping.unhook(panel);
  });

  if (el?.hasAttribute('data-last')) {
    ch = 1;
    implied = tabs[ch];
  } else if (ch === undefined) {
    ch = tabs.findIndex((tab) => tab.classList.contains('active'));

    // jank, but if the button is :first-child, it's a Previous button, etc.
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

  const finalEl = implied || el;
  finalEl.classList.add('active');
  finalEl.setAttribute('aria-selected', 'true');
  document.querySelector('.h-text-version').textContent = finalEl.getAttribute('aria-label');
  if (finalEl.nextElementSibling) {
    const preview = (
      finalEl.nextElementSibling.getAttribute('aria-label')
      || finalEl.nextElementSibling.nextElementSibling.getAttribute('aria-label')
    );
    next.removeAttribute('data-last');
    next.textContent = preview;
  } else {
    next.setAttribute('data-last', true);
    next.textContent = 'Repeat';
  }
  if (panels[ch] !== undefined) {
    panels[ch].style.display = 'block';
    panels[ch].removeAttribute('inert');
    // panels[ch].setAttribute('aria-hidden', 'false');
    if (!soft) {
      if (!noRing) {
        panels[ch].querySelector('[role=document]').focus({ preventScroll: true });
      }
      document.querySelector('.h-text-version').scrollIntoView({ behavior: 'smooth' });
    }
  }

  ACCESSIBILITY.swiping.hook(panels[ch]);

  return false;
}


function buildTimelineGradient() {
  const row = document.querySelector('#chapters-control .tabs');
  const links = row.querySelectorAll(':scope > a');
  const totalWidth = row.offsetWidth;
  links.forEach((link) => {
    const linkLeft = link.getBoundingClientRect().left;
    const relativeLeft = linkLeft - row.getBoundingClientRect().left;
    link.style.backgroundSize = `${totalWidth}px 100%`;
    link.style.backgroundPosition = `-${relativeLeft}px 0%`;
  });
}
