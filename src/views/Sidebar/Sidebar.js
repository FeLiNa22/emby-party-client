import { Component } from "react";

// chat app
import ChatApp from "../../components/Chat/ChatApp";
import User from "./User";


const SERVER_MESSAGES = {
  USER_LEFT : (user) => `${user} left the party`,
  USER_JOINED : (user) => `${user} joined the party`,
  DISCONNECTED : () => `You disconnected from the server`
}

class Sidebar extends Component {
  state = {
    messages: [],
  };

  constructor(props) {
    super(props);
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      console.log(message);
      if (message && message.content) {
        switch (message.content) {
          case "create-party":
            //createParty(message.data.url);
            sendResponse({data : {partyId : "fakeshit"}});
            break;
          case "join-party":
            //joinParty(message.data.partyId);
            break;
          case "already-connected":
            sendResponse({data : {partyId : "fakeshit"}});
            break;
          default:
            break;
        }
      }
    });
    const user_props = {
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

    this.user = new User(user_props);
  }

  componentDidMount() {
   
    

    const createParty = (url) => {
      this.user.createParty(url);
    }

    const joinParty = (partyId) => {
      this.user.joinParty(partyId);
    }

    
  }

  onRecieveMessage = (text) => {
    // recieve a message through the chat (through backend)
    console.log("message recieved " + text);
  };

  render() {
    return (
      <div className="Sidebar">
        <ChatApp
          title={"Chat"}
          messages={this.state.messages}
          onSendMessage={(text) => this.user.messageParty(text)}
        />
        {/* <Avatar /> */}
        {/* <Playback /> */}
      </div>
    );
  }
}

export default Sidebar;