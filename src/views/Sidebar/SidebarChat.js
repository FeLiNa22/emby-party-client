// chat app
import { Component } from "react";
import Chat from "../../components/Chat/Chat";

// import custom css for chat
import "./SidebarChat.css";

const message_type = {
  ALERT: "alert",
  BROADCAST: "broadcast",
  WHISPER: "whisper",
};

class SidebarChat extends Component {
  constructor(props) {
    super(props);
    const { controller } = props;
    this.controller = controller; // sidebar controller
  }

  onSendMessage = (text) => {
    var message = { date: new Date(), text };
    this.controller.sendMessage(message);
  };

  setupInitialChat = () => {
    for (var member of this.controller.getPartyMembers()) {
      if (!this.controller.isMe(member)) {
        this.addAlertMessage(member.name + " is in the party");
      }
    }
    this.addAlertMessage("You joined the party");
  };

  componentDidMount = () => {
    this.setupInitialChat();

    this.controller.setOnBroadcast(this.addUserMessage);

    this.controller.setOnWhisper(this.addWhisperedMessage);

    this.controller.setOnAlert(this.addAlertMessage);

    this.controller.setOnDelete(this.removeMessage);

    this.controller.setOnUserJoin((user) => {
      this.addAlertMessage(
        (this.controller.isMe(user) ? "You" : user.name) + " joined the party"
      );
    });

    this.controller.setOnUserLeft((user) => {
      this.addAlertMessage(
        (this.controller.isMe(user) ? "You" : user.name) + " left the party"
      );
    });
  };

  removeMessage = (message) => {
    const { id: m_id, text, date } = message;
    this.chatRef.removeMessage(m_id);
  };

  addAlertMessage = (message) => {
    const { id: m_id, text, date } = message;
    this.chatRef.addMessage(
      m_id,
      <div className="SidebarChat-message SidebarChat-broadcast">
        <p>{message}</p>
      </div>
    );
  };

  addWhisperedMessage = (user, message) => {
    const { id: u_id, name } = user;
    const { id: m_id, text, date } = message;
    this.chatRef.addMessage(
      m_id,
      <div className="SidebarChat-message SidebarChat-local">
        <p>{name} whispered</p>
        <p>{message}</p>
      </div>
    );
  };

  addUserMessage = (user, message) => {
    const { id: u_id, name } = user;
    const { id: m_id, text, date } = message;
    this.chatRef.addMessage(
      m_id,
      <div
        className={`SidebarChat-message SidebarChat-user ${
          this.controller.isMe(user) ? "me" : "other"
        }`}
      >
        <p className="SidebarChat-user-name">
          {this.controller.isMe(user) ? "You" : name} said
        </p>
        <p>{text}</p>
      </div>
    );
  };

  render = () => {
    return (
      <Chat
        ref={(ref) => (this.chatRef = ref)}
        onSendMessage={this.onSendMessage}
      />
    );
  };
}

export default SidebarChat;
