import { Video } from "./Video";

const EVENTS = [
  "abort",
  "durationchange",
  "emptied",
  "ended",
  "error",
  "pause",
  "play",
  "playing",
  "progress",
  "ratechange",
  "seeked",
  "seeking",
  "stalled",
  "suspend",
  "timeupdate",
  "waiting",
];

export class HTML5VideoAdapter extends Video {
  src;
  time;
  playbackRate;
  paused;
  seeking;
  subtitles;

  //private
  events = [];

  constructor() {
    super();
    this.getHTML5Video();
    // add event listeners to the video
    for (var event of EVENTS) {
      this.HTML5video.addEventListener(event, this.onUpdate, false);
    }
  }

  //private
  getSubtitles = (textTracks) => {
    var subtitles = new Array();
    for (var textTrack of textTracks) {
      if (textTrack.kind === "subtitles") {
        subtitles.push(textTrack.label);
      }
    }
    return subtitles;
  };

  setOnUpdate = (event) => {
    this.events.push(event);
  };

  onUpdate = () => {
    this.getHTML5Video();
    if (!this.reactingToResponse) {
      this.events.map((e) => e(this));
    }
  };

  update = async (video) => {
    const { src, time, playbackRate, paused, seeking, subtitles } = video;
    this.reactingToResponse = true;
    // update source
    if (this.src !== src) {
      this.src = src;
      this.HTML5video.src = src;
    }

    // update timestamp if lagging behind by more than 1/2 second
    if (Math.abs(time - this.time) > 0.5) {
      this.time = time;
      this.HTML5video.currentTime = time;
    }

    // update video playing/pausing
    if (this.paused && !paused) {
      this.paused = paused;
      this.HTML5video.play();
    } else if (!this.paused && paused) {
      this.paused = paused;
      this.HTML5video.pause();
    }
    this.reactingToResponse = false;
  };

  getHTML5Video = () => {
    var videos = document.getElementsByTagName("VIDEO");
    this.HTML5video = videos[0];

    const { src, currentTime, playbackRate, paused, seeking, textTracks } =
      this.HTML5video;

    this.src = src;
    this.time = currentTime;
    this.playbackRate = playbackRate;
    this.paused = paused;
    this.seeking = seeking;
    this.subtitles = this.getSubtitles(textTracks);
  };
}
