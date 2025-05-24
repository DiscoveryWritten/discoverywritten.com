let yt_player;

const youtube = {
  playerId: 'yt_player',
  videoId: 'CVb1oR5DnHM',
};
const _ = youtube;

// Youtube player init must be on a promise because we let the user destroy
// and reintroduce the frame at will. We need to restart the process from the
// original promise for the iframe_api resource.
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

async function _prepYTPlayer(id) {
  if (id === 'youtube') {
    await _loadYouTubeAPI()
    yt_player = new window.YT.Player(_.playerId, {
      videoId: _.videoId,
      events: {},
    });
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
