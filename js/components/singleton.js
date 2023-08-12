class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = this;
      this.select = (selector) => document.querySelector(selector);

      this.playlist = this.select(".playlist");
      this.duration = this.select("#duration");


      this.phonograph = this.select(".phonograph-record img");
      this.songTitle = this.select(".music-title");
      this.singer = this.select(".music-singer");
      this.current_time = this.select("#current-time");
      this.playbackBar = this.select("#playback-time-bar #progress-container");
      this.volumeBar = this.select("#volumeSlider");
      this.progressBar = this.select("#progress-bar");
      this.playIcon = this.select("#playIcon");
      this.pauseIcon = this.select("#pauseIcon");
      this.prevIcon = this.select("#prevIcon");
      this.nextIcon = this.select("#nextIcon");
      this.shuffleIcon = this.select("#shuffleIcon");
    }
    return Singleton.instance;
  }
}

const elementSingleton = new Singleton();

export default elementSingleton;
