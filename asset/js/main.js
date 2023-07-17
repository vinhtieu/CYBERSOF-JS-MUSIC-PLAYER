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
    singer: "Anastasio Eric",
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
];

// const storedData = localStorage.getItem("playList");
// const playList = JSON.parse(storedData);
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
let count = 1;
let index = 0;
playback_time.value = `0`;

let sliderInput;
let songDuration;
let songElapsedTime;
let audio = new Audio(playList[index].song);

document.addEventListener("DOMContentLoaded", () => {
  // setSong(0);
  loadAlbum(playList.length);
  getSongInfo(0);
  setBackground(0);
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
});

album.addEventListener("click", (e) => {
  // let trackIndex;
  removeBackground(index);
  const trackPlayBtn = e.target.closest(".track").querySelector(".fa-play");
  const trackPauseBtn = e.target.closest(".track").querySelector(".fa-pause");
  let target = e.target.closest(".track");
  if (target) {
    index = [...album.children].indexOf(target);
    console.log("Clicked track: ", target);
    console.log("Clicked track index:", index);
  }

  trackPlayBtn.style.display = "none";
  trackPauseBtn.style.display = "block";

  pauseSong();
  audio = new Audio(playList[index].song);
  getSongInfo(index);
  setTimeStamp(0);
  playSong(0);
});

playback_time.addEventListener("input", () => {
  sliderInput = Math.floor((playback_time.value * audio.duration) / 100);
  setTimeStamp(sliderInput);
  pauseSong();
  playSong(sliderInput);
});

// volumeInput.addEventListener("input", () => {
//   let value = volumeInput.value / 100;
//   console.log(value);
//   audio.volume = value;
// });

playBtn.addEventListener("click", () => {
  let value = Math.floor(audio.currentTime);
  playSong(value);
});

pauseBtn.addEventListener("click", pauseSong);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// btnSideCard.addEventListener("click", () => {
//   uploadFile.classList.toggle("slide-in");

//   if (count % 2 == 0) {
//     btnSideCard.innerHTML = `
//         <i class="fa fa-angle-double-left"></i>
//         `;

//     btnSideCard.style.background = "#0d1326";
//     btnSideCard.style.color = "white";
//     count++;
//   } else {
//     btnSideCard.innerHTML = `<i class="fa fa-angle-double-right"></i>`;
//     btnSideCard.style.background = "rgba(255, 255, 255, 1)";
//     btnSideCard.style.color = "black";
//     count++;
//   }
// });

// btnUpload.addEventListener("click", () => {
//   let nameImg = imgFile.value;
//   let nameFile = mp3File.value;
//   let songTitle = title.value;
//   let songPerformer = performer.value;
//   if (
//     nameImg == "" ||
//     nameFile == "" ||
//     songTitle == "" ||
//     songPerformer == ""
//   ) {
//     alert.classList.toggle("hide");
//     alert.classList.add("alert-danger");
//     alert.innerHTML = `❌ Please Fill All The Blanks`;
//   } else {
//     let obj = {
//       image: `./asset/img/${nameImg}`,
//       song: `./asset/music/${nameFile}`,
//       title: `${songTitle}`,
//       singer: `${songPerformer}`,
//     };

//     if (playList === null) {
//       let array = [];
//       array.push(obj);
//       let jsonData = JSON.stringify(array);
//       localStorage.setItem("playList", jsonData);
//     } else {
//       playList.push(obj);
//       let jsonData = JSON.stringify(playList);
//       localStorage.setItem("playList", jsonData);
//     }

//     alert.classList.toggle("hide");
//     alert.classList.remove("alert-danger");
//     alert.classList.add("alert-success");
//     alert.innerHTML = `✔️ Success`;
//     imgFile.value = "";
//     mp3File.value = "";
//     title.value = "";
//     performer.value = "";
//   }

//   setTimeout(() => {
//     alert.classList.toggle("hide");
//   }, 5000);

//   //  localStorage.clear();
//   //   console.log(playList);
// });

function playSong(value) {
  phonograph.classList.add("animate-rotate");
  audio.currentTime = value;
  audio.play();
  intervalId = setInterval(() => {
    getTimeStamp();
    if (audio.currentTime - audio.duration == 0) {
      nextSong();
    }
  }, 1000);
  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
  setBackground(index);
  setTrackPlayBtn();
}

function pauseSong() {
  phonograph.classList.remove("animate-rotate");
  clearInterval(intervalId);
  audio.pause();
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
}

function nextSong() {
  console.log("next");
  clearInterval(intervalId);
  if (playList[index + 1] == null) {
    console.warn("No record");
    phonograph.classList.remove("animate-rotate");
  } else {
    audio.pause();

    index++;
    audio = new Audio(playList[index].song);
    getSongInfo(index);
    setTimeStamp(0);
    playBtn.style.display = "none";
    pauseBtn.style.display = "block";
    playSong(0);
  }
}

function prevSong() {
  clearInterval(intervalId);
  if (playList[index - 1] == null) {
    console.warn("No record");
  } else {
    audio.pause();
    index--;
    audio = new Audio(playList[index].song);
    getSongInfo(index);
    setTimeStamp(0);
    playBtn.style.display = "none";
    pauseBtn.style.display = "block";
    playSong(0);
  }
}

function getSongInfo(index) {
  console.log("selecting song");
  audio.addEventListener("loadedmetadata", () => {
    songDuration = audio.duration;
    console.log(
      "🚀 ~ file: main.js:267 ~ audio.addEventListener ~ songDuration:",
      songDuration
    );
    let minutes = Math.floor(songDuration / 60);
    let seconds = Math.floor(songDuration % 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    phonograph.src = `${playList[index].image}`;
    songTitle.innerHTML = `<p>${playList[index].title}</p>`;
    singer.innerHTML = `<p>${playList[index].singer}</p>`;
    current_time.innerHTML = `<p>0:00</p>`;
    duration.innerHTML = `<p>${minutes}:${seconds}</p>`;
    playback_time.value = `0`;
  });
}

function getTimeStamp() {
  let elapsedTime = audio.currentTime;
  // convert audio.currentTime (in seconds) to minutes
  let minutes = Math.floor(elapsedTime / 60);
  // calculate the remaining seconds
  let seconds = Math.floor(elapsedTime % 60);

  seconds < 10
    ? (current_time.innerHTML = `<p>${minutes}:0${seconds}</p>`)
    : (current_time.innerHTML = `<p>${minutes}:${seconds}</p>`);

  playback_time.value = `${Math.floor((elapsedTime * 100) / songDuration) + 1}`;
  progress_bar.style.width = `${
    Math.floor((elapsedTime * 100) / songDuration) + 1
  }%`;

  console.log("playback_time: ", playback_time.value);
  console.log(
    "progress-bar width: ",
    `${Math.floor((elapsedTime * 100) / songDuration) + 1}%`
  );
}

function setTimeStamp(value) {
  if (value > 0) {
    let elapsedTime = (value * 100) / songDuration;

    let minutes = Math.floor(value / 60);
    let seconds = Math.floor(value % 60);

    seconds < 10
      ? (current_time.innerHTML = `<p>${minutes}:0${seconds}</p>`)
      : (current_time.innerHTML = `<p>${minutes}:${seconds}</p>`);

    playback_time.value = `${Math.floor(elapsedTime)}`;
    progress_bar.style.width = `${Math.floor(elapsedTime)}%`;
  } else {
    current_time.innerHTML = `<p>0:00</p>`;
    audio.currentTime = 0;
    playback_time.value = 0;
    progress_bar_container.setAttribute("aria-valuenow", `0`);
    progress_bar.style.width = `0%`;
  }
}

function removeBackground(value) {
  [...album.children][value].style.background = "transparent";
}
function setBackground(value) {

  [...album.children][value].style.background = "#1a1a1a";
}

function loadAlbum(value) {
  let str = "";
  length = value;
  for (let i = 0; i < length; i++) {
    str += `
      <div class="track track-${i + 1}">
            <div class="track__image">
              <img src='${playList[i].image}'/>
              <div class="overlay">
               <i class="fa fa-play" id="trackPlayBtn"></i>
                <i class="fas fa-pause" id="trackPauseBtn"></i>
              </div>
            </div>
            <div class="track__content">
              <div class="track__title">${playList[i].title}</div>
              <div class="track__singer">${playList[i].singer}</div>
            </div>
          </div>`;
  }

  album.innerHTML = str;
}
