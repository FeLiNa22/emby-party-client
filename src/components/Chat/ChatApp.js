import { Component } from "react";
import "./ChatApp.css";

import EmojiPicker from "./EmojiPicker";
import { SendIcon } from "./Icons";

class Title extends Component {
  static defaultProps = {
    title: "",
  };

  render() {
    return (
      <div className="Chat-title">
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}

class SendMessageForm extends Component {
  static defaultProps = {
    placeholder: "send message...",
    onSendMessage: (text) => {
      console.log(text);
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isEmojiPickerMounted: false,
    };
  }

  handleSend = (e) => {
    e.preventDefault();
    this.props.onSendMessage(this.inputRef.value);
    // clear input
    this.inputRef.value = "";
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      // if enter is pressed send the message
      case "Enter":
        this.handleSend(e);
        break;
      default:
        break;
    }
  };

  onSelectEmoji = (emoji) => {
    this.inputRef.value += emoji.native;
  };

  render() {
    return (
      <div className="Chat-sendForm">
        <EmojiPicker onSelectEmoji={this.onSelectEmoji} />
        <input
          placeholder={this.props.placeholder}
          type="text"
          className="Chat-input"
          maxLength="300"
          ref={(ref) => {
            this.inputRef = ref;
          }}
          onKeyDown={this.handleKeyDown}
        ></input>
        <button className="Chat-button" onClick={this.handleSend}>
          <SendIcon style={{ color: "#63ce50" }} />
        </button>
      </div>
    );
  }
}

class Messages extends Component {
  static defaultProps = {
    messages: [],
    renderChatMessage: (text) => {
      return (
        <div className="Chat-message">
          <p>{text}</p>
        </div>
      );
    },
  };

  constructor(props) {
    super(props);
    this.state = { messages: this.props.messages };
  }

  addMessage = (msg) => {
    this.setState((prevState) => ({
      messages: prevState.messages.concat(msg),
    }));
  };

  render() {
    return (
      <div className="Chat-container">
        {this.state.messages.map((msg) => this.props.renderChatMessage(msg))}
      </div>
    );
  }
}

/* The chat app requires only the onSendMessage function */

class ChatApp extends Component {
  // relay msg to Messages component
  addMessage = (msg) => {
    this.messageRef.addMessage(msg);
  };

  render() {
    return (
      <div className="Chat-app">
        <Title title={this.props.title} />
        <Messages
          ref={(ref) => (this.messageRef = ref)}
          renderChatMessage={this.props.renderChatMessage}
        />
        <SendMessageForm onSendMessage={this.props.onSendMessage} />
      </div>
    );
  }
}

export default ChatApp;
