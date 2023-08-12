import elementSingleton from "./singleton.js";

// Functions for playlist UI

const PlayList = {
  getTrack: (trackId) => [...elementSingleton.playlist.children][trackId],
  getPlayIcon: (trackId) =>
    [...elementSingleton.playlist.children][trackId].querySelector(".fa-play"),
  getPauseIcon: (trackId) =>
    [...elementSingleton.playlist.children][trackId].querySelector(".fa-pause"),
  getOverlay: (trackId) =>
    [...elementSingleton.playlist.children][trackId].querySelector(".overlay"),

  focusTrack(trackId) {
    let track = this.getTrack(trackId);
    track.classList.add("activeTrack");
  },

  blurTrack(trackId) {
    let track = this.getTrack(trackId);
    track.classList.remove("activeTrack");
    this.removeTrackBtn(trackId);
  },

  setTrackPlayIcon(trackId) {
    const playIcon = this.getPlayIcon(trackId);
    const trackPauseIcon = this.getPauseIcon(trackId);
    const overlay = this.getOverlay(trackId);

    playIcon.style.display = "none";
    trackPauseIcon.style.display = "block";
    overlay.style.opacity = "1";
  },

  setTrackPauseIcon(trackId) {
    const playIcon = this.getPlayIcon(trackId);
    const trackPauseIcon = this.getPauseIcon(trackId);
    const overlay = this.getOverlay(trackId);

    trackPauseIcon.style.display = "none";
    playIcon.style.display = "block";
    overlay.style.opacity = "1";
  },

  removeTrackBtn(trackId) {
    const playIcon = this.getPlayIcon(trackId);
    const trackPauseIcon = this.getPauseIcon(trackId);
    const overlay = this.getOverlay(trackId);

    playIcon.style.display = "";
    trackPauseIcon.style.display = "";
    overlay.style.opacity = "";
  },

  renderPlayList(playList) {
    let str = "";
    let count = 0;
    elementSingleton.playlist.innerHTML = "";

    for (const track of playList) {
      let duration = track.duration;
      let minutes = Math.floor(duration / 60);
      let seconds = Math.floor(duration % 60);
      seconds = seconds < 10 ? "0" + seconds : seconds;

      str += `
              <div class="track" id="track${
                count + 1
              }" onclick="handleSelectTrack(${count})">
                <div class="track__image">
                 <img src="${track.image}"/>
                  <div class="overlay">
                    <i class="fa fa-play" id="trackPlayIcon"></i>
                    <i class="fas fa-pause" id="trackPauseIcon"></i>
                  </div>
                </div>
                <div class="track__content">
                  <div class="track__title">${track.title}</div>
                  <div class="track__singer">${track.singer}</div>
                </div>
                <div class="track__duration">${minutes}:${seconds}</div>
                <div class="track__option"><i class="fas fa-ellipsis-v"></i></div>
              </div>`;
      count++;
    }

    // Update the album container once all tracks are loaded
    elementSingleton.playlist.innerHTML = str;
  },
};

export default PlayList;
