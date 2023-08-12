import Track from "../model/Track.js";

const MusicData = {
  getSongDuration(playList, trackId) {
    let songDuration = playList[trackId].duration;
    let minutes = Math.floor(songDuration / 60);
    let seconds = Math.floor(songDuration % 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return [minutes, seconds];
  },

  loadSongDuration(track) {
    return new Promise((resolve) => {
      track.addEventListener("loadedmetadata", () => {
        resolve(track.duration);
      });
    });
  },

  async loadSongData(database) {
    let array = [];
    for (const data of database) {
      let newTrack = new Track();
      let audioElement = new Audio(data.song);
      let duration = await this.loadSongDuration(audioElement);
      newTrack.image = data.image;
      newTrack.title = data.title;
      newTrack.singer = data.singer;
      newTrack.song = data.song;
      newTrack.duration = duration;
      array.push(newTrack);
    }
    return array;
  },
};

export default MusicData;
