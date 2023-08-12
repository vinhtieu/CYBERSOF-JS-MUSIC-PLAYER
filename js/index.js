import Track from "./model/Track.js";
import database from "./service/database.js";
import elementSingleton from "./components/singleton.js";
import toggleSidebar from "./components/sidebar.js";
import MusicPlayer from "./components/music-player.js";
import MusicData from "./components/music-data.js";
import PlayList from "./components/playlist.js";

// *----- Variables -----*

let isPlaying = false;
let isMouseUp = false;
let isDragging = false;
let intervalId;
let currentSongIndex = 0;
let audioElement;
let playListArr;

// *----- EventListener -----*

document.addEventListener("DOMContentLoaded", (e) => {
  start();
  toggleSidebar(e);
});

// *Music Player*

// When the mouse button is pressed down on the progress bar container
elementSingleton.playbackBar.addEventListener("mousedown", (e) => {
  // Set the flag to indicate dragging and mouse button release
  isDragging = true;
  isMouseUp = true;
});

// When the mouse is moved, update playback while dragging the progress bar
document.addEventListener("mousemove", (e) => {
  updatePlaybackDuringDrag(e);
});

// When the mouse is moved within the progress bar container, update playback while dragging
elementSingleton.playbackBar.addEventListener("mousemove", (e) => {
  updatePlaybackDuringDrag(e);
});

// When the mouse button is released after dragging the progress bar
document.addEventListener("mouseup", (e) => {
  updatePlaybackAfterDrag(e);
});

// When the mouse button is released within the progress bar container after dragging
elementSingleton.playbackBar.addEventListener("mouseup", (e) => {
  updatePlaybackAfterDrag(e);
});

elementSingleton.playIcon.addEventListener("click", () => {
  playPauseTrack(currentSongIndex);
  showPlayIcon(currentSongIndex);
});

elementSingleton.pauseIcon.addEventListener("click", () => {
  pauseTrack(currentSongIndex);
  showPauseIcon(currentSongIndex);
});

elementSingleton.prevIcon.addEventListener("click", () => {
  prevTrack();
});

elementSingleton.nextIcon.addEventListener("click", () => {
  nextTrack();
});

elementSingleton.shuffleIcon.addEventListener("click", () => {
  shuffleTrack();
  initAudio(0);
  PlayList.renderPlayList(playListArr);
  initTrack();
  MusicPlayer.loadMusicPlayer(playListArr, 0);
  MusicPlayer.setPlayBackBar(0);
});

elementSingleton.volumeBar.addEventListener("input", () => {
  audioElement.volume = elementSingleton.volumeBar.value;
});

// *----- Helpers Functions -----*

//

// Functions for skipping song

function updatePlaybackDuringDrag(e) {
  if (isDragging) {
    let timeSkip = getTimeSkip(e);
    setTimeSkip(timeSkip);
  }
}

function updatePlaybackAfterDrag(e) {
  if (isMouseUp) {
    let timeSkip = getTimeSkip(e);
    setTimeSkip(timeSkip);
    showPlayIcon(currentSongIndex);
    pauseTrack(currentSongIndex);
    playTrack(timeSkip);
    isMouseUp = false;
    isDragging = false;
  }
}

function getTimeSkip(e) {
  const progressBarRect = elementSingleton.playbackBar.getBoundingClientRect();
  let offsetX = e.clientX - progressBarRect.left;
  let width = (offsetX * 100) / progressBarRect.width;
  let timeSkip = (width * audioElement.duration) / 100;
  return timeSkip;
}

async function setTimeSkip(timeSkip) {
  if (timeSkip > 0) {
    let songDuration = playListArr[currentSongIndex].duration;
    let elapsedTime = (timeSkip * 100) / songDuration;
    let minutes = Math.floor(timeSkip / 60);
    let seconds = Math.floor(timeSkip % 60);

    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    MusicPlayer.setCurrentTime(minutes, formattedSeconds);
    MusicPlayer.setPlayBackBar(elapsedTime.toFixed(2));
  } else {
    audioElement.currentTime = 0;
    MusicPlayer.setCurrentTime(0, 0);
    MusicPlayer.setPlayBackBar(0);
  }
}

function updatePlaybackTime() {
  if (!isDragging) {
    let elapsedTime = audioElement.currentTime;
    let songDuration = playListArr[currentSongIndex].duration;
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = Math.floor(elapsedTime % 60);

    seconds < 10
      ? (elementSingleton.current_time.innerHTML = `<p>${minutes}:0${seconds}</p>`)
      : (elementSingleton.current_time.innerHTML = `<p>${minutes}:${seconds}</p>`);

    elementSingleton.progressBar.style.width = `${
      (elapsedTime / songDuration) * 100
    }%`;
  }
}

// Functions for manipulating song

function playTrack(value, trackId) {
  if (isPlaying === false) {
    setTimeout(() => {
      MusicPlayer.rotatePhonograph();
      audioElement.currentTime = value;
      audioElement.play();
      intervalId = setInterval(() => {
        updatePlaybackTime(trackId);
        if (audioElement.currentTime - audioElement.duration == 0) {
          nextTrack();
        }
      }, 1000);
      isPlaying = true;
    }, 500);
  }
}

function playPauseTrack(trackId) {
  let timeStamp = Math.floor(audioElement.currentTime);
  playTrack(timeStamp, trackId);
}

function pauseTrack() {
  if (isPlaying === true) {
    MusicPlayer.stopPhonograph();
    clearInterval(intervalId);
    audioElement.pause();
    isPlaying = false;
  }
}

function nextTrack() {
  changeTrack(currentSongIndex + 1);
}

function prevTrack() {
  changeTrack(currentSongIndex - 1);
}

function changeTrack(trackId) {
  if (playListArr[trackId] == undefined) {
    console.warn("No record");
    pauseTrack(currentSongIndex);
    resetTrack();
  } else {
    clearInterval(intervalId);
    PlayList.blurTrack(currentSongIndex);
    currentSongIndex = trackId;
    handleSwitchToNewTrack(currentSongIndex);
    playTrack(0, currentSongIndex);
    MusicPlayer.setMusicPlayerPlayIcon();
    PlayList.setTrackPlayIcon(currentSongIndex);
  }
}

function resetTrack() {
  elementSingleton.phonograph.classList.remove("animate-rotate");
  showPauseIcon(currentSongIndex);
  setTimeSkip(0);
}

function shuffleTrack() {
  const length = playListArr.length;

  playListArr.forEach((track, index) => {
    let randomNum;
    let tempArr = [];

    do {
      randomNum = Math.floor(Math.random() * length);
    } while (index == randomNum);

    tempArr[0] = track;
    playListArr[index] = playListArr[randomNum];
    playListArr[randomNum] = tempArr[0];
  });
}

function handleSelectTrack(trackId) {
  if (currentSongIndex == trackId) {
    if (isPlaying) {
      pauseTrack(trackId);
      showPauseIcon(trackId);
    } else {
      playTrack(trackId);
      showPlayIcon(trackId);
    }
  } else {
    PlayList.blurTrack(currentSongIndex);
    handleSwitchToNewTrack(trackId);
    showPlayIcon(trackId);
  }
}

function handleSwitchToNewTrack(trackId) {
  pauseTrack(currentSongIndex);
  initAudio(trackId);
  MusicPlayer.loadMusicPlayer(playListArr, trackId);
  setTimeSkip(0, trackId);
  playTrack(0, trackId);
  PlayList.focusTrack(trackId);
  currentSongIndex = trackId;
}

// Functions for displaying icon

function showPlayIcon(trackId) {
  PlayList.setTrackPlayIcon(trackId);
  MusicPlayer.setMusicPlayerPlayIcon();
}

function showPauseIcon(trackId) {
  PlayList.setTrackPauseIcon(trackId);
  MusicPlayer.setMusicPlayerPauseIcon();
}

// Initialize

function initAudio(trackId) {
  audioElement = new Audio(playListArr[trackId].song);
}

function initTrack() {
  PlayList.focusTrack(0);
  showPauseIcon(0);
}

async function start() {
  playListArr = await MusicData.loadSongData(database);
  window.handleSelectTrack = handleSelectTrack;
  initAudio(0);
  PlayList.renderPlayList(playListArr);
  initTrack();
  MusicPlayer.loadMusicPlayer(playListArr, 0);
  MusicPlayer.setPlayBackBar(0);
}
