import { io } from "socket.io-client";
require("dotenv").config();

const socket_url = "ws://localhost:4000";

const socket_options = {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123",
  },
  withCredentials: false,
};

export class Member {
  socket = io(socket_url, socket_options);

  existsParty = (partyId, callback) => {
    this.socket.emit("party:exists", partyId, (bool) => {
      callback(bool);
    });
  };

  createParty = (callback) => {
    this.socket.emit("party:create", (party) => {
      callback(party);
    });
  };

  joinParty = (partyId, callback) => {
    this.socket.emit("party:join", partyId, (party) => {
      callback(party);
    });
  };

  leaveParty = (partyId, callback) => {
    this.socket.emit("party:leave", partyId, (bool) => {
      callback(bool);
    });
  };

  broadcastMessage = (partyId, message) => {
    this.socket.emit("chat:broadcast", partyId, message);
  };

  whisperMessage = (partyId, message, memberId) => {
    this.socket.emit("chat:whisper", partyId, message, memberId);
  };

  updateVideo = (partyId, video) => {
    this.socket.emit("video:update", partyId, video);
  };

  setOnConnect = (callback) => {
    this.socket.on("connect", () => {
      callback();
    });
  };

  setOnDisconnect = (callback) => {
    this.socket.on("disconnect", () => {
      callback();
    });
  };

  setOnUserJoinListener = (callback) => {
    this.socket.on("party:user-joined", (party, newMember) => {
      callback(party, newMember);
    });
  };

  setOnUserLeftListener = (callback) => {
    this.socket.on("party:user-left", (party, oldMember) => {
      callback(party, oldMember);
    });
  };

  setOnBroadcastListener = (callback) => {
    this.socket.on("chat:broadcast", (party, user, message) => {
      callback(party, user, message);
    });
  };

  setOnWhisperListener = (callback) => {
    this.socket.on("chat:whisper", (party, user, message) => {
      callback(party, user, message);
    });
  };

  setOnAlertListener = (callback) => {
    this.socket.on("chat:alert", (party, message) => {
      callback(party, message);
    });
  };

  setOnDeleteListener = (callback) => {
    this.socket.on("chat:delete", (party, user, message) => {
      callback(party, user, message);
    });
  };

  setOnVideoUpdateListener = (callback) => {
    this.socket.on("video:update", (party, video) => {
      callback(party, video);
    });
  };
}
