"use strict";

export class VideoController {
  member;
  video;

  constructor(member, video) {
    this.member = member;
    this.video = video;
    // setup event listeners on the video object
    this.setupVideoEventListeners();
  }

  setupVideoEventListeners = () => {
    // broadcast updates to other member of party
    this.video.setOnUpdate((video) => {
      const party = this.member.getParty();
      if (party) {
        this.member.updateVideo(party.id, video);
      }
    });

    // update own video on receiving an update
    this.member.setOnVideoUpdateListener((party, video) => {
      if (this.member.getParty().id === party.id) {
        this.video.update(video);
      }
    });
  };
}
