import { Component } from "react";

// chat app
import ChatApp from '../../components/Chat/ChatApp';
import SidebarCollapseBtn from '../../components/Sidebar/SidebarCollapseBtn';
import User from "./User";

// import custom css for chat
import './SidebarChat.css';

const message_type = {
  LOCAL : "local",
  BROADCAST : "broadcast",
  USER : "user",
}

class Sidebar extends Component {
static defaultProps = {
  onToggle : () => console.log("sidebar toggle clicked")
}

  constructor(props) {
    super(props);

    this.state = {
      view: null,
    };
    this.setupEventListeners();

    const user_props = {
      onDisconnect: () =>
        this.chatRef.addMessage({
          message: "You disconnected from the party.",
        }),
      onPartyCreated: ({ partyId }) => {
        this.chatRef.addMessage({
          message: "You have created a party",
          type: message_type.LOCAL,
        });
      },
      onPartyJoined: ({ partyId }) => {
        this.chatRef.addMessage({
          message: "You have joined the party",
          type: message_type.LOCAL,
        });
      },
      onUserJoined: ({ user }) =>
        this.chatRef.addMessage({
          user,
          message: "joined the party",
          type: message_type.BROADCAST,
        }),
      onUserLeft: ({ user }) =>
        this.chatRef.addMessage({
          user,
          message: "left",
          type: message_type.BROADCAST,
        }),
      onUserMessage: ({ user, message }) =>
        this.chatRef.addMessage({ user, message, type: message_type.USER }),
    };
    this.user = new User(user_props);
  }

  setupEventListeners = () => {
    const self = this; // used for scoping issues
    
  };


  renderChatMessage = ({type, message, user=null }) => {
    switch (type) {
      case message_type.BROADCAST:
        return (
          <div className="SidebarChat-message SidebarChat-broadcast">
            <p>
              {user.name ?? "Anonymous"} {message}
            </p>
          </div>
        );
      case message_type.LOCAL:
        return (
          <div className="SidebarChat-message SidebarChat-local">
            <p>{message}</p>
          </div>
        );
      case message_type.USER:
        return (
          <div className={`SidebarChat-message SidebarChat-user ${(this.user.socket.id == user.sid) ? "me" : "other"}`}>
            <p className="SidebarChat-user-name">{user.name ?? "Anonymous"}</p>
            <p>{message}</p>
          </div>
        );
      default:
          break;
    }
  }

  render() {
    return (
      <div className="Sidebar">
        <SidebarCollapseBtn onClick={this.props.onToggle}/>
        <ChatApp
          ref={(ref) => (this.chatRef = ref)}
          renderChatMessage={this.renderChatMessage}
          onSendMessage={(text) => this.user.messageParty(text)}
        />
        {/* <Avatar /> */}
        {/* <Playback /> */}
      </div>
    );
  }
}

export default Sidebar;
