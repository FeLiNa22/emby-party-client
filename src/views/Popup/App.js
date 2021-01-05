import React, {Component} from 'react';
import OTPInput from '../../components/OTP/OTPInput'

import { io } from "socket.io-client";

import logo from './../../assets/emby.png'
import './App.css';

const socket_url = "ws://localhost:4000";

const socket_options = {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123",
  },
  withCredentials: false,
};

class App extends Component {
  static defaultProps = {
    messages : []
  }

  constructor(props) {
    super(props);

    this.partyId = null;
    this.socket = io(socket_url, socket_options);

    this.state = {
      view: this.defaultView,
      messages: this.props.messages,
      headerInfo : "Login to your emby account and then start or join a party to start watching movies together"
    };
  }

  componentDidMount() {
    // handle user messaging in chat
    this.socket.on("user message party", (socketId, msg) => {
      console.log("user" + socketId + "had sent a message " + msg);
      this.setState((prevState) => ({ messages: prevState.messages }));
    });

    // handle user leaving the party
    this.socket.on("user left party", (socketId) => {
      var msg = "User has left the party " + socketId;
      console.log(msg);
      this.addMessage(msg);
    });

    // handle user joining the party
    this.socket.on("user joined party", (socketId, partyId) => {
      var msg = "User has joined the party " + socketId;
      console.log(msg);

      // if we are the user who joined
      if (socketId === this.socket.id) {
        this.setState({ view: this.confirmationView });
      }

      console.log(msg);
      this.addMessage(msg);
    });

    // handle user creating the party
    this.socket.on("user created party", (partyId) => {
      console.log("party created " + partyId);

      // updates the partyId of the party
      this.setState({ view: this.confirmationView });

      var msg = "Invite your friends to the party using " + partyId + "!";
      this.addMessage(msg);
    });

    // handle errors generated
    this.socket.on("error", (msg) => {
      this.addMessage(msg);
    });
  }

  componentWillUnmount() {
    // closes the socket connection
    this.socket.close();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" display="block">
          <img src={logo} className="App-icon" alt="Emby Party" />
          <h1>Emby Party</h1>
        </header>
        <p className="App-info">{this.state.headerInfo}</p>
        {this.state.view}
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
    this.socket.emit("create party");
  };

  joinParty = (partyId) => {
    console.log("joining party");
    this.socket.emit("join party", partyId);
  };

  addMessage(msg) {
    console.log(msg);
    this.setState((prevState) => {
      var newMessage = prevState.messages.concat(msg);
      return { messages: newMessage };
    });
  }

  joinView = 
      (<div>
      <OTPInput
        numInputs={6}
        onChange={(partyId) => {this.partyId = partyId}}
        onSubmit={(partyId) => this.joinParty(partyId)}
      />
      <br/>
      <button className="App-button" onClick={() => this.joinParty(this.partyId)}>
        Join Party
      </button>
    </div>
  );

  defaultView = (
    <div>
      <button className="App-button" onClick={this.createParty}>
        Create Party
      </button>
      <br />
      <button
        className="App-button"
        onClick={() =>
          this.setState({
            view: this.joinView, headerInfo : "Paste your code below to join the emby party"
          })
        }
      >
        Join Party
      </button>
    </div>
  );

  confirmationView =  (
    <div>
      <h1> You have joined the party </h1>
    </div>
  );
}


export default App
