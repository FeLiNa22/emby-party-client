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
const ERROR_CONNECT_FAILED = {
  error: "Couldn't connect to server... Please try again later",
};
export class Member {
  socket = null;
  party = null;
  user = null;

  constructor() {
    this.socket = io.connect(socket_url, socket_options);
    this.authorise()
      .then((member) => {
        this.updateUser(member);
      })
      .catch((err) => console.log(err));
  }

  updateParty = (party) => {
    this.party = party;
  };

  updateUser = (user) => {
    this.user = user;
  };

  isInParty = () => {
    return this.party !== null;
  };

  getParty = () => {
    return this.party;
  };

  getUser = () => {
    return this.user;
  };

  authorise = () =>
    new Promise((resolve, reject) => {
      if (!this.socket.connected) {
        this.rejectIfNotConnectedAfterSomeTime(reject);
      }
      this.socket.emit("member:authorise", (member) => {
        resolve(member);
      });
    });

  existsParty = (partyId) =>
    new Promise((resolve, reject) => {
      if (!this.socket.connected) {
        this.rejectIfNotConnectedAfterSomeTime(reject);
      }
      this.socket.emit("party:exists", partyId, (bool) => {
        if (bool.error) {
          reject(bool);
        } else {
          resolve(bool);
        }
      });
    });

  createParty = () =>
    new Promise((resolve, reject) => {
      if (!this.socket.connected) {
        this.rejectIfNotConnectedAfterSomeTime(reject);
      }
      this.socket.emit("party:create", (party) => {
        if (party.error) {
          reject(party);
        } else {
          this.updateParty(party);
          resolve(party);
        }
      });
    });

  joinParty = (partyId) =>
    new Promise((resolve, reject) => {
      if (!this.socket.connected) {
        this.rejectIfNotConnectedAfterSomeTime(reject);
      }
      this.socket.emit("party:join", partyId, (party) => {
        if (party.error) {
          reject(party);
        } else {
          this.updateParty(party);
          resolve(party);
        }
      });
    });

  leaveParty = (partyId) =>
    new Promise((resolve, reject) => {
      if (!this.socket.connected) {
        this.rejectIfNotConnectedAfterSomeTime(reject);
      }
      this.socket.emit("party:leave", partyId, (bool) => {
        resolve(bool);
      });
    });

  broadcastMessage = (partyId, message) => {
    this.socket.emit("chat:broadcast", partyId, message);
  };

  whisperMessage = (partyId, message, memberId) => {
    this.socket.emit("chat:whisper", partyId, message, memberId);
  };

  deleteMessage = (partyId, messageId) => {
    this.socket.emit("chat:delete", partyId, messageId);
  };

  updateVideo = (partyId, video) => {
    this.socket.emit("video:update", partyId, video);
  };

  setOnConnect = (callback) => {
    this.socket.on("connect", () => {
      this.updateParty(null);
      callback();
    });
  };

  setOnDisconnect = (callback) => {
    this.socket.on("disconnect", () => {
      this.updateParty(null);
      callback();
    });
  };

  setOnUserJoinListener = (callback) => {
    this.socket.on("party:user-joined", (party, newMember) => {
      this.updateParty(party);
      callback(party, newMember);
    });
  };

  setOnUserLeftListener = (callback) => {
    this.socket.on("party:user-left", (party, oldMember) => {
      this.updateParty(party);
      callback(party, oldMember);
    });
  };

  setOnBroadcastListener = (callback) => {
    this.socket.on("chat:broadcast", (party, user, message) => {
      this.updateParty(party);
      callback(party, user, message);
    });
  };

  setOnWhisperListener = (callback) => {
    this.socket.on("chat:whisper", (party, user, message) => {
      this.updateParty(party);
      callback(party, user, message);
    });
  };

  setOnAlertListener = (callback) => {
    this.socket.on("chat:alert", (party, message) => {
      this.updateParty(party);
      callback(party, message);
    });
  };

  setOnDeleteListener = (callback) => {
    this.socket.on("chat:delete", (party, user, message) => {
      this.updateParty(party);
      callback(party, user, message);
    });
  };

  setOnVideoUpdateListener = (callback) => {
    this.socket.on("video:update", (party, video) => {
      this.updateParty(party);
      callback(party, video);
    });
  };

  rejectIfNotConnectedAfterSomeTime(reject) {
    setTimeout(() => {
      if (!this.socket.connected) reject(ERROR_CONNECT_FAILED);
    }, 500);
  }
}
