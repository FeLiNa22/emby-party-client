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
  isConnected = false;

  static defaultProps = {
    username: "",
    onConnect: () => console.log("connected to server"),
    onDisconnect: () => console.log("disconnected from server"),
    onPartyCreated: ({ partyId }) => console.log(partyId),
    onPartyJoined: ({ partyId }) => console.log(partyId),
    onPartyUserJoining: ({ user, partyId }) =>
      console.log("user " + user + " joined the party " + partyId),
    onPartyUserLeft: ({ user, partyId }) =>
      console.log("user " + user + " left the party " + partyId),
    onRecieveMessage: ({ msg }) => console.log(msg),
  };

  constructor(props) {
    this.props = { ...User.defaultProps, ...props };

    // initiate socket
    this.socket = io(socket_url, socket_options);
    this.setupEventListeners();
  }

  setUsername = (username) => {
    this.props.username = username;
  };

  createParty = (url) => {
    const onResponse = ({ partyId }) => {
      this.partyId = partyId;
      this.partyUrl = url;
      this.props.onPartyCreated({ partyId });
    };
    this.socket.emit("party:create", { url }, onResponse);
  };

  joinParty = (partyId) => {
    const onResponse = ({ partyId, url }) => {
      this.partyId = partyId;
      this.partyUrl = url;
      this.props.onPartyJoined({ partyId, url });
    };
    this.socket.emit("party:join", { partyId }, onResponse);
  };

  messageParty = (message) => {
    if (this.isConnected && this.partyId) {
      this.socket.emit("party:message", { partyId: this.partyId, message });
    }
  };

  setupEventListeners = () => {
    // check socket connected to server
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.props.onConnect();
    });

    // when socket is disconnected
    this.socket.on("disconnect", () => {
      this.isConnected = false;
      this.props.onDisconnect();
    });

    // when user joins a party
    this.socket.on("response:user-joined", (resp) => {
      this.props.onPartyJoined(resp);
    });

    // when a different user leaves the party
    this.socket.on("response:user-left", (resp) => {
      this.props.onPartyUserLeft(resp);
    });

    // when any user (including yourself) sends a message in the party
    this.socket.on("response:user-message", (resp) => {
      this.props.onRecieveMessage(resp);
    });
  };
}

export default User;
