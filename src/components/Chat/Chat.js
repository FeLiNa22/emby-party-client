import { Component } from "react";
import "./Chat.css";

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
    placeholder: "Send a message...",
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
    // only trigger send if input is not all whitespace
    if (this.inputRef.value.replace(/\s/g, "").length) {
      this.props.onSendMessage(this.inputRef.value);
      // clear input
      this.inputRef.value = "";
    }
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
    messages: [], // array type => [{id, html}]
  };

  constructor(props) {
    super(props);
    // I have allowed passing existiong message through props
    // to support stateful messaging
    this.state = { messages: this.props.messages };
  }

  componentDidMount = () => {
    this.scrollToBottom();
  };

  componentDidUpdate = () => {
    this.scrollToBottom();
  };

  scrollToBottom = () => {
    this.messagesEndRef.scrollIntoView({ behavior: "smooth" });
  };

  addMessage = (id, html) => {
    this.setState((prevState) => ({
      messages: prevState.messages.concat({ id, html }),
    }));
  };

  removeMessage = (id) => {
    this.setState((prevState) => ({
      messages: prevState.messages.filter((msg) => msg.id !== id),
    }));
  };

  render() {
    return (
      <div className="Chat-container">
        {this.state.messages.map((msg) => msg.html)}
        <div
          style={{ float: "left", clear: "both" }}
          ref={(ref) => (this.messagesEndRef = ref)}
        />
      </div>
    );
  }
}

/* The chat app requires only the onSendMessage function */

class Chat extends Component {
  constructor(props) {
    super(props);
    const { title, onSendMessage } = props;
  }

  addMessage = (id, message) => {
    this.messagesRef.addMessage(id, message);
  };

  removeMessage = (id) => {
    this.messagesRef.removeMessage(id);
  };

  render() {
    return (
      <div className="Chat-app">
        <Title title={this.props.title} />
        <Messages ref={(ref) => (this.messagesRef = ref)} />
        <SendMessageForm onSendMessage={this.props.onSendMessage} />
      </div>
    );
  }
}

export default Chat;
