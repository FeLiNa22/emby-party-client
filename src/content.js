/*global chrome*/

import { Component } from "react";
import ChatApp from "./components/Chat/ChatApp";

import IFrame from './components/IFrame/IFrame.js'

/*
msg = {
    user : string;
    text : string;
    timestamp : time;
}
*/

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: true };
  }

  onSendMessage = (text) => {
    // sends a message through the chat (through backend)
    console.log("message sent " + text);
  };

  toggleCollapse = () => {
    this.setState((prevState) => ({ isVisible: !prevState.isVisible }));
  };

  render() {
    return (
      <div>
      <link
          data-frame
          type="text/css"
          rel="stylesheet"
          href="./assets/css/Sidebar.css"
        /> 
        <IFrame title={"emby-sidebar"} frameBorder="0" >
       <button className="Sidebar-toggle" onClick={this.toggleCollapse}>
          {this.state.isVisible ? "Hide" : "Show"}
        </button>
        <div className="Sidebar" >
          <ChatApp onSendMessage={this.onSendMessage} />
          {/* <Avatar /> */}
          {/* <Playback /> */}
        </div>
      </IFrame>
      </div>
    );
  }
}

export default Sidebar;
