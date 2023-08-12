import elementSingleton from "./singleton.js";
import MusicData from "./music-data.js";


const MusicPlayer = {
  loadMusicPlayer(playList,trackId) {
    elementSingleton.phonograph.src = `${playList[trackId].image}`;
    elementSingleton.songTitle.innerHTML = `<p>${playList[trackId].title}</p>`;
    elementSingleton.singer.innerHTML = `<p>${playList[trackId].singer}</p>`;
    let [minutes, seconds] = MusicData.getSongDuration(playList,trackId);
    elementSingleton.duration.innerHTML = `<p>${minutes}:${seconds}</p>`;
  },

  rotatePhonograph() {
    elementSingleton.phonograph.classList.add("animate-rotate");
  },

  stopPhonograph() {
    elementSingleton.phonograph.classList.remove("animate-rotate");
  },

  setCurrentTime(minutes, seconds) {
    if (minutes == 0 && seconds == 0) {
      elementSingleton.current_time.innerHTML = `<p>0:00</p>`;
    } else {
      elementSingleton.current_time.innerHTML = `<p>${minutes}:${seconds}</p>`;
    }
  },

  setPlayBackBar(value) {
    elementSingleton.progressBar.style.width = `${value}%`;
    elementSingleton.playbackBar.setAttribute(
      "aria-valuenow",
      `${value}`
    );
  },

  setMusicPlayerPlayIcon() {
    elementSingleton.playIcon.style.display = "none";
    elementSingleton.pauseIcon.style.display = "block";
  },

  setMusicPlayerPauseIcon() {
    elementSingleton.pauseIcon.style.display = "none";
    elementSingleton.playIcon.style.display = "block";
  },
};

export default MusicPlayer;
