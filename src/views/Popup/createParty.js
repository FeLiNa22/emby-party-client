import React, { Component } from "react";
import "./App.css";
import { io } from "socket.io-client";

import logo from "../../assets/emby.png";

import OTPInput from '../../components/OTPInput'

const socket_url = "ws://localhost:4000";

const socket_options = {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123",
  },
  withCredentials: false,
};

class PartyConnect extends Component {
 

  constructor(props) {
    super(props);
    this.state = {
      view: this.defaultView,
      partyId: null,
      messages: [],
      socket: io(socket_url, socket_options),
      headerInfo : "Login to your emby account and then start or join a party to start watching movies together"
    };
  }

  componentDidMount() {
    // handle user messaging in chat
    this.state.socket.on("user message party", (socketId, msg) => {
      console.log("user" + socketId + "had sent a message " + msg);
      this.setState((prevState) => ({ messages: prevState.messages }));
    });

    // handle user leaving the party
    this.state.socket.on("user left party", (socketId) => {
      var msg = "User has left the party " + socketId;
      console.log(msg);
      this.addMessage(msg);
    });

    // handle user joining the party
    this.state.socket.on("user joined party", (socketId, partyId) => {
      var msg = "User has joined the party " + socketId;
      console.log(msg);

      // if we are the user who joined
      if (socketId === this.state.socket.id) {
        this.setState({ partyId });
        this.setState({ view: this.joinedConfirmation });
      }

      console.log(msg);
      this.addMessage(msg);
    });

    // handle user creating the party
    this.state.socket.on("user created party", (partyId) => {
      console.log("party created " + partyId);

      // updates the partyId of the party
      this.setState({ partyId });
      this.setState({ view: this.joinedConfirmation });

      var msg = "Invite your friends to the party using " + partyId + "!";
      this.addMessage(msg);
    });

    // handle errors generated
    this.state.socket.on("error", (msg) => {
      this.addMessage(msg);
    });
  }

  componentWillUnmount() {
    // closes the socket connection
    this.state.socket.close();
  }

  render() {
    return (
      <div>
        <header className="App-header" display="block">
          <img src={logo} className="App-icon" alt="Emby Party" />
          <h1>Emby Party</h1>
        </header>
        <p className="App-info">{this.state.headerInfo}</p>
        {this.state.view(this)}
        <ul>
          {this.state.messages.map((msg, idx) => {
            return <li key={idx}>{msg}</li>;
          })}
        </ul>
      </div>
    );
  }

  createParty = () => {
    console.log("creating party");
    this.state.socket.emit("create party");
  };

  joinParty = (partyId) => {
    console.log("joining party");
    this.state.socket.emit("join party", partyId);
  };

  addMessage(msg) {
    console.log(msg);
    this.setState((prevState) => {
      var newMessage = prevState.messages.concat(msg);
      return { messages: newMessage };
    });
  }


  joinView = (self) => (
    <div>
      <OTPInput
        numInputs={6}
        onChange = {(partyId) => {
          self.setState({partyId});
        }}
      />
      <br/>
      <button className="App-button" onClick={() => self.joinParty(self.state.partyId)}>
        Join Party
      </button>
    </div>
  );

  defaultView = (self) => (
    <div>
      <button className="App-button" onClick={() => self.createParty()}>
        Create Party
      </button>
      <br />
      <button
        className="App-button"
        onClick={() =>
          self.setState({
            view: self.joinView, headerInfo : "Paste your code below to join the emby party"
          })
        }
      >
        Join Party
      </button>
    </div>
  );

  joinedConfirmation = (self) => (
    <div>
      <h1> You have joined the party </h1>
    </div>
  );
}

export default PartyConnect;
