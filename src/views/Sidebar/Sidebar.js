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
  partyId = null;
  partyUrl = null;

  state = {
    messages: [],
    isConnected : false,
  };

  constructor(props) {
    super(props);

    const user_props = {
      username: "",
      onConnect: () => this.setState({isConnected : true}),
      onDisconnect: () => this.setState({isConnected : false}),
      onPartyCreated: ({ partyId }) => {this.partyId = partyId},
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
    const handlePopupMessages = (message, sender, sendResponse) => {
      switch (message.content) {
        case "create-party":
          var onResponse = ({partyId}) => {
            console.log(partyId);
            this.partyId = partyId;
            this.partyUrl = message.data.url;
            // send response message back to popup
            chrome.runtime.sendMessage(null, {popup : "joined-party", data:{partyId}});
          }


          // try and create the party room
          this.user.createParty(message.data.url, onResponse);
          break;

        case "join-party":
          console.log("trying to join party "+ message.data.partyId);

          var onResponse = ({partyId, url}) => {
            console.log(partyId);
            this.partyId = partyId;
            this.partyUrl = url;
            // send response message back to popup
            chrome.runtime.sendMessage(null, {popup : "joined-party", data:{partyId}});
          }

          this.user.joinParty(message.data.partyId, onResponse);
          break;

        case "already-connected":
          console.log("checking already connected"+ this.partyId);
          if(this.state.isConnected && this.partyId){
            sendResponse({data : {partyId : this.partyId}});
          }
          break;
        default:
          break;
      }
    }

    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message && message.content) {
        handlePopupMessages(message, sender, sendResponse);
      }
    });

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