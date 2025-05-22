let useFocus = false;
// let gradient;
const iframeCache = new Map();
document.addEventListener('DOMContentLoaded', () => {
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
    panel.setAttribute('aria-hidden', 'true');
  });

  if (ch === undefined) {
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

  // const maxRadius = Math.floor(tabs.length / 2);
  tabs.forEach((tab, i) => {
    const distance = Math.abs(i - ch);
    const clamped = Math.min(distance, tabs.length);
    // console.log(i, ch, distance, clamped, tab);
    for (const cls of [...tab.classList]) {
      if (/^distance-\d+$/.test(cls)) {
        tab.classList.remove(cls);
      }
    }
    tab.classList.remove('active');
    tab.classList.add(`distance-${clamped}`);
    tab.setAttribute('aria-selected', 'false');
  });

  if (el === null && implied === null) {
    implied = tabs[ch];
  }
  // console.log('-', ch, tabs[ch]);

  const finalEl = implied || el;
  finalEl.classList.add('active');
  finalEl.setAttribute('aria-selected', 'true');

  if (panels[ch] !== undefined) {
    panels[ch].style.display = 'block';
    panels[ch].setAttribute('aria-hidden', 'false');
    if (!soft) {
      panels[ch].querySelector('[role=document]').focus();
    }
  }

  return false;
}

// // screen-reader function for busy iframes
// function togglePlayer(on=true) {
//   document.querySelector('player').setAttribute('aria-hidden', !on);
//   document.getElementById('music-show').hidden = on;
//   document.getElementById('music-hide').hidden = !on;
// }
