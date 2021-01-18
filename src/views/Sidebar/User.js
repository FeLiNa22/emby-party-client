import { io } from "socket.io-client";

const socket_url = "ws://localhost:4000";

const socket_options = {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123",
  },
  withCredentials: false,
};

class User {
  partyId = null;
  partyUrl = null;
  name = "";

  static defaultProps = {
    onConnect: () => console.log("connected to server"),
    onDisconnect: () => console.log("disconnected from server"),
    onPartyCreated: (resp) => console.log(resp),
    onPartyJoined: (resp) => console.log(resp),
    onUserJoined: ({ user, partyId }) =>
      console.log("user " + user + " joined the party " + partyId),
    onUserLeft: ({ user, partyId }) =>
      console.log("user " + user + " left the party " + partyId),
    onUserMessage: ({ user, message }) =>
      console.log("user " + user + " sent message : " + message),
  };

  constructor(props) {
    this.props = { ...User.defaultProps, ...props };

    // initiate socket
    this.socket = io(socket_url, socket_options);
    this.setupEventListeners();
  }

  // packs the non-sensitive user details into an object before sending to server
  userDetails = () => ({ name: this.name, sid: this.socket.id });

  reset = () => {
    this.partyId = null;
    this.partyUrl = null;
  };

  setUsername = (name) => {
    this.name = name;
  };

  createParty = (url, next = null) => {
    function blobToDataURL(blobUrl, callback) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob";

      xhr.onload = function () {
        var recoveredBlob = xhr.response;

        var reader = new FileReader();

        reader.onload = function () {
          callback(reader.result);
        };

        reader.readAsDataURL(recoveredBlob);
      };

      xhr.open("GET", blobUrl, true);
      xhr.send();
    }

    if (url.includes("blob")) {
      console.log(url);
      //**blob to dataURL**
      blobToDataURL(url, (dataUrl) => this.createParty(dataUrl, next));
    }

    const onCallback = (resp) => {
      if (resp.data) {
        var { partyId, url } = resp.data;
        this.partyId = partyId;
        this.partyUrl = url;
        this.props.onPartyCreated(resp.data);
      } else if (resp.error) {
        this.props.onError(resp.error);
      }
      if (next) next(resp);
    };
    this.socket.emit("party:create", { url }, onCallback);
  };

  joinParty = (partyId, next = null) => {
    const onCallback = (resp) => {
      if (resp.data) {
        var { partyId, url } = resp.data;
        this.partyId = partyId;
        this.partyUrl = url;
        this.props.onPartyJoined(resp.data);
      } else if (resp.error) {
        this.props.onError(resp.error);
      }
      if (next) next(resp);
    };
    this.socket.emit(
      "party:join",
      { user: this.userDetails(), partyId },
      onCallback
    );
  };

  messageParty = (message) => {
    if (this.partyId && message) {
      this.socket.emit("party:message", {
        user: this.userDetails(),
        partyId: this.partyId,
        message,
      });
    }
  };

  setupEventListeners = () => {
    // check socket connected to server
    this.socket.on("connect", () => {
      this.props.onConnect();
    });

    // when socket is disconnected
    this.socket.on("disconnect", () => {
      this.reset();
      this.props.onDisconnect();
    });

    // when user joins a party
    this.socket.on("response:user-joined", (resp) => {
      this.props.onUserJoined(resp);
    });

    // when a different user leaves the party
    this.socket.on("response:user-left", (resp) => {
      this.props.onUserLeft(resp);
    });

    // when any user (including yourself) sends a message in the party
    this.socket.on("response:user-message", (resp) => {
      this.props.onUserMessage(resp);
    });
  };
}

export default User;
