let playList = [
  {
    image: "./asset/img/yuki-no-hana.jpg",
    song: "./asset/music/yuki-no-hana.mp4",
    title: "Snow Flower",
    singer: "Mika Nakashima",
  },
  {
    image: "./asset/img/until-i-found-you.jpg",
    song: "./asset/music/until-i-found-you.mp3",
    title: "Until I Found You",
    singer: "Stephen Sanchez",
  },
  {
    image: "./asset/img/just-the-two-of-us.jpg",
    song: "./asset/music/just-the-two-of-us.mp4",
    title: "Just The Two Of Us",
    singer: "Bill Withers",
  },
  {
    image: "./asset/img/still-got-the-blues.jfif",
    song: "./asset/music/still-got-the-blues.mp4",
    title: "Still Got The Blues",
    singer: "Gary Moore",
  },
  {
    image: "./asset/img/stay-with-me.jfif",
    song: "./asset/music/stay-with-me.mp4",
    title: "Stay With Me",
    singer: "Miki Matsubara",
  },
  {
    image: "./asset/img/plastic-love.jpg",
    song: "./asset/music/plastic-love.mp4",
    title: "Plastic Love",
    singer: "Mariya Takeuchi",
  },
  {
    image: "./asset/img/matabaki.jpg",
    song: "./asset/music/matabaki.mp4",
    title: "Mabataki",
    singer: "Back Number",
  },
  {
    image: "./asset/img/le-temps-des-fleurs.jpg",
    song: "./asset/music/le-temps-des-fleurs.mp4",
    title: "Le Temps Des Fleurs",
    singer: "Dalida",
  },
  {
    image: "./asset/img/le-geant-de-papier.jpg",
    song: "./asset/music/le-geant-de-papier.mp4",
    title: "Le Geant De Papier",
    singer: "Jean Jacques Lafon",
  },
  {
    image: "./asset/img/aimer.jpg",
    song: "./asset/music/hoshikuzu-venus.mp4",
    title: "Hoshikuzu Venus",
    singer: "Aimer",
  },
  {
    image: "./asset/img/koibito-yo.jpg",
    song: "./asset/music/koibito-yo.mp4",
    title: "Koibito Yo",
    singer: "Itsuwa Mayumi",
  },
  {
    image: "./asset/img/les-valses-de-vienne.jpg",
    song: "./asset/music/les-valses-de-vienne.mp4",
    title: "Les Valses De Vienne",
    singer: "Francois Feldman",
  },
  {
    image: "./asset/img/notre-dame-de-paris.jfif",
    song: "./asset/music/notre-dame-de-paris.mp4",
    title: "Notre Dame De Paris",
    singer: "Belle",
  },
  {
    image: "./asset/img/stand-by-me.jpg",
    song: "./asset/music/stand-by-me.mp4",
    title: "Stand By Me",
    singer: "Seal",
  },
  {
    image: "./asset/img/when-a-man-loves-a-woman.jpg",
    song: "./asset/music/when-a-man-loves-a-woman.mp4",
    title: "When A Man Loves A Woman",
    singer: "Michael Bolton",
  },
];

const btnSideCard = document.querySelector("#btnSideCard");

const album = document.querySelector(".album");
const track = document.querySelectorAll(".track");

const songTitle = document.querySelector(".music-title");
const singer = document.querySelector(".music-singer");

const current_time = document.querySelector("#current-time");
const playback_time = document.querySelector("#playback-time");
const progress_bar_container = document.querySelector("#progress-container");
const progress_bar = document.querySelector("#progress-bar");
const duration = document.querySelector("#duration");
const volumeInput = document.querySelector("#volume");

const phonograph = document.querySelector(".card__phonograph-record img");
const play_pause_ctrl = document.querySelector(".card__play-pause");
const playBtn = document.querySelector("#playBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

const uploadFile = document.querySelector(".upload-file");
const mp3File = document.querySelector("#mp3File");
const imgFile = document.querySelector("#imgFile");
const title = document.querySelector("#title");
const performer = document.querySelector("#performer");
const btnUpload = document.querySelector("#btnUpload");
const alert = document.querySelector("#alert");

let intervalId;
let isPlaying = false;
let isMouseUp = false;
let isDragging = false;
let count = 1;
let index = 0;
let trackPointer = 0;
let sliderInput;
let songDuration;
let songElapsedTime;
let audio = new Audio(playList[index].song);

document.addEventListener("DOMContentLoaded", (e) => {
  loadAlbum(playList.length);
  getSongInfo(0);
  setBackground(0);
  setMusicPlayerPauseBtn();
  setTrackPauseBtn(index);
  progress_bar.style.width = "0%";
});

// The user skipping the music
progress_bar_container.addEventListener("mousedown", (e) => {
  isDragging = true;
  isMouseUp = true;
});

// The progress bar can be dragged
// Even when the mouse pointer goes outside the progress bar area
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let timeSkip = getTimeSkip(e);
    setTimeStamp(timeSkip);
  }
});

progress_bar_container.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let timeSkip = getTimeSkip(e);
    setTimeStamp(timeSkip);
  }
});

// The user releasing the timestamp outside the progress_bar
document.addEventListener("mouseup", (e) => {
  if (isMouseUp) {
    let timeSkip = getTimeSkip(e);
    setTimeStamp(timeSkip);
    setMusicPlayerPlayBtn();
    setTrackPlayBtn(index);
    pauseSong();
    playSong(timeSkip);
  }
  isMouseUp = false;
  isDragging = false;
});

progress_bar_container.addEventListener("mouseup", (e) => {
  let timeSkip = getTimeSkip(e);
  setTimeStamp(timeSkip);
  setMusicPlayerPlayBtn();
  setTrackPlayBtn(index);
  pauseSong();
  playSong(timeSkip);
  isMouseUp = false;
  isDragging = false;
});

album.addEventListener("click", (e) => {
  console.log(`positionX: ${e.clientX}`);

  removeBackground(index);
  removeTrackBtn(index);
  let target = e.target.closest(".track");
  if (target) {
    index = [...album.children].indexOf(target);
  }

  if (trackPointer == index) {
    if (isPlaying === true) {
      pauseSong();
      setMusicPlayerPauseBtn();
      setTrackPauseBtn(index);
      isPlaying = false;
    } else {
      let value = Math.floor(audio.currentTime);
      playSong(value);
      setMusicPlayerPlayBtn();
      setBackground(index);
      setTrackPlayBtn(index);
      isPlaying = true;
    }
  } else {
    pauseSong();
    audio = new Audio(playList[index].song);
    getSongInfo(index);
    setTimeStamp(0);
    playSong(0);
    setMusicPlayerPlayBtn();
    setBackground(index);
    setTrackPlayBtn(index);
    isPlaying = true;
    trackPointer = index;
  }
});

// volumeInput.addEventListener("input", () => {
//   let value = volumeInput.value / 100;
//   console.log(value);
//   audio.volume = value;
// });

playBtn.addEventListener("click", () => {
  let value = Math.floor(audio.currentTime);
  playSong(value);
  setMusicPlayerPlayBtn();
  setBackground(index);
  setTrackPlayBtn(index);
});
pauseBtn.addEventListener("click", () => {
  pauseSong();
  setMusicPlayerPauseBtn();
  setTrackPauseBtn(index);
});
prevBtn.addEventListener("click", () => {
  prevSong();
});
nextBtn.addEventListener("click", () => {
  nextSong();
});


function getTimeSkip(e) {
  let positionX = e.clientX - progress_bar_container.offsetLeft;
  let width = (positionX * 100) / progress_bar_container.clientWidth;
  let timeSkip = (width * audio.duration) / 100;
  return timeSkip;
}

function playSong(value) {
  if (isPlaying === false) {
    phonograph.classList.add("animate-rotate");
    audio.currentTime = value;
    audio.play();
    intervalId = setInterval(() => {
      getTimeStamp();
      if (audio.currentTime - audio.duration == 0) {
        nextSong();
      }
    }, 1000);

    isPlaying = true;
  }
}

function pauseSong() {
  if (isPlaying === true) {
    phonograph.classList.remove("animate-rotate");
    clearInterval(intervalId);
    audio.pause();
    isPlaying = false;
  }
}

function nextSong() {
  if (playList[index + 1] == null) {
    console.warn("No record");
    pauseSong();
    resetSong();
  } else {
    clearInterval(intervalId);
    removeBackground(index);
    removeTrackBtn(index);
    pauseSong();
    index++;
    trackPointer++;
    selectSong(index);
    setMusicPlayerPlayBtn();
    setBackground(index);
    setTrackPlayBtn(index);
    playSong(0);
  }
}

function prevSong() {
  if (playList[index - 1] == null) {
    console.warn("No record");
    pauseSong();
    resetSong();
  } else {
    clearInterval(intervalId);
    removeBackground(index);
    removeTrackBtn(index);
    pauseSong();
    index--;
    trackPointer--;
    selectSong(index);
    setMusicPlayerPlayBtn();
    setBackground(index);
    setTrackPlayBtn(index);
    playSong(0);
  }
}

function selectSong(value) {
  audio = new Audio(playList[value].song);
  resetSong();
  getSongInfo(value);
}

function resetSong() {
  phonograph.classList.remove("animate-rotate");
  setMusicPlayerPauseBtn();
  setTrackPauseBtn(index);
  setTimeStamp(0);
}

function getSongInfo(value) {
  audio.addEventListener("loadedmetadata", () => {
    songDuration = audio.duration;
    let minutes = Math.floor(songDuration / 60);
    let seconds = Math.floor(songDuration % 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    phonograph.src = `${playList[value].image}`;
    songTitle.innerHTML = `<p>${playList[value].title}</p>`;
    singer.innerHTML = `<p>${playList[value].singer}</p>`;
    current_time.innerHTML = `<p>0:00</p>`;
    duration.innerHTML = `<p>${minutes}:${seconds}</p>`;
  });
}

function getTimeStamp() {
  if (!isDragging) {
    let elapsedTime = audio.currentTime;
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = Math.floor(elapsedTime % 60);

    seconds < 10
      ? (current_time.innerHTML = `<p>${minutes}:0${seconds}</p>`)
      : (current_time.innerHTML = `<p>${minutes}:${seconds}</p>`);

    progress_bar.style.width = `${(elapsedTime / songDuration) * 100}%`;
  }
}

function setTimeStamp(value) {
  if (value > 0) {
    let elapsedTime = (value * 100) / songDuration;

    let minutes = Math.floor(value / 60);
    let seconds = Math.floor(value % 60);

    seconds < 10
      ? (current_time.innerHTML = `<p>${minutes}:0${seconds}</p>`)
      : (current_time.innerHTML = `<p>${minutes}:${seconds}</p>`);

    progress_bar.style.width = `${elapsedTime.toFixed(2)}%`;
    progress_bar_container.setAttribute(
      "aria-valuenow",
      `${elapsedTime.toFixed(2)}`
    );
  } else {
    current_time.innerHTML = `<p>0:00</p>`;
    audio.currentTime = 0;
    progress_bar_container.setAttribute("aria-valuenow", `0`);
    progress_bar.style.width = `0%`;
  }
}

function setBackground(value) {
  [...album.children][value].style.background = "#1a1a1a";
}

function removeBackground(value) {
  [...album.children][value].style.background = "transparent";
}

function setMusicPlayerPlayBtn() {
  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
}

function setMusicPlayerPauseBtn() {
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
}

function setTrackPlayBtn(value) {
  let trackPlayBtn = [...album.children][value].querySelector(".fa-play");
  let trackPauseBtn = [...album.children][value].querySelector(".fa-pause");
  let overlay = [...album.children][value].querySelector(".overlay");

  trackPlayBtn.style.display = "none";
  trackPauseBtn.style.display = "block";
  overlay.style.opacity = "1";
}

function setTrackPauseBtn(value) {
  let trackPlayBtn = [...album.children][value].querySelector(".fa-play");
  let trackPauseBtn = [...album.children][value].querySelector(".fa-pause");
  let overlay = [...album.children][value].querySelector(".overlay");

  trackPlayBtn.style.display = "block";
  trackPauseBtn.style.display = "none";
  overlay.style.opacity = "1";
}

function removeTrackBtn(value) {
  let trackPlayBtn = [...album.children][value].querySelector(".fa-play");
  let trackPauseBtn = [...album.children][value].querySelector(".fa-pause");
  let overlay = [...album.children][value].querySelector(".overlay");

  trackPlayBtn.style.display = "block";
  trackPauseBtn.style.display = "none";
  overlay.style.opacity = "";
}

function loadTrackMetadata(track) {
  return new Promise((resolve) => {
    track.addEventListener("loadedmetadata", () => {
      resolve(track.duration);
    });
  });
}

async function loadAlbum(value) {
  let str = "";
  album.innerHTML = "";
  length = value;
  let time = [];

  for (let i = 0; i < length; i++) {
    let track = new Audio(playList[i].song);

    let duration = await loadTrackMetadata(track);
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    time.push(`${minutes}:${seconds}`);

    str += `
    <div class="track track-${i + 1}">
          <div class="track__image">
            <img src="${playList[i].image}"/>
            <div class="overlay">
             <i class="fa fa-play" id="trackPlayBtn"></i>
              <i class="fas fa-pause" id="trackPauseBtn"></i>
            </div>
          </div>
          <div class="track__content">
            <div class="track__title">${playList[i].title}</div>
            <div class="track__singer">${playList[i].singer}</div>
          </div>
          <div class="track__duration">${time[i]}</div>
          <div class="track__option"><i class="fas fa-ellipsis-v"></i></div>
        </div>`;
  }
  // Update the album container once all tracks are loaded
  album.innerHTML = str;
}
