export class Video {
  src;
  time;
  playbackRate;
  paused;
  seeking;
  subtitles;
  update = () => {};
  onUpdate = (callback) => {
    callback();
  };
  toJSON = () => {
    const { src, time, playbackRate, paused, seeking, subtitles } = this;
    return { src, time, playbackRate, paused, seeking, subtitles };
  };
}
