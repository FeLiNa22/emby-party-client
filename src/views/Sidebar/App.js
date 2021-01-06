import { Component } from "react";

// chat app
import ChatApp from "../../components/Chat/ChatApp";


import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }

  onRecieveMessage = (text) => {
    // recieve a message through the chat (through backend)
    console.log("message recieved " + text);
  };

  onSendMessage = (text) => {
    // sends a message through the chat (through backend)
    console.log("message sent " + text);
  };

  render() {
    return (
      <div className="Sidebar">
        <ChatApp
          messages={this.state.messages}
          onSendMessage={this.onSendMessage}
        />
        {/* <Avatar /> */}
        {/* <Playback /> */}
      </div>
    );
  }
}

export default App;
