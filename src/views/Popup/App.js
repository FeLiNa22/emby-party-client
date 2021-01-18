import React, { Component } from "react";
import OTPInput from "../../components/OTP/OTPInput";
import OTPOutput from "../../components/OTP/OTPOutput";

import logo from "./../../assets/emby.png";
import "./App.css";

const apiServer = "http://localhost:5000";

// injection script
const script = { file: "/static/js/content.js" };
// injection code (determines if page has shareable video)
const code = { code: 'document.getElementsByTagName("VIDEO").length > 0;' };

class App extends Component {
  static defaultProps = {
    defaultErrorMessage: "Oops. Something went wrong... try again in a bit.",
    defaultHeader: "Start watching movies together",
  };

  constructor(props) {
    super(props);

    this.state = {
      copyState: false,
      partyId: "",
      view: this.defaultView,
      headerInfo: this.props.defaultHeader,
    };
  }

  setHeader = (text) => {
    this.setState({ headerInfo: text });
  };

  setView = (view) => {
    if (view) {
      this.setState({ view });
    } else {
      this.setState({ view: () => <></> });
    }
  };

  hasResponse = (resp) => !chrome.runtime.lastError;
  hasError = (resp) => resp == null || resp.error;

  handleError = (resp) => {
    try {
      this.setHeader(resp.error.message);
    } catch {
      this.setHeader(this.props.defaultErrorMessage);
      this.setView();
    }
  };

  componentDidMount() {
    const self = this; // for scoping issues
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message && message.popup) {
        switch (message.popup) {
          case "joined-party":
            if (self.hasError(message)) {
              self.handleError(message);
            } else {
              if (message.data.partyId) {
                self.setState({ partyId: message.data.partyId });
                self.setHeader("Share the code with your friends");
                self.setView(self.connectedView);
              }
            }
            break;
          default:
            break;
        }
      }
    });

    // check if the active tab is an emby page with a video on it
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      // check if the page already is connected to an emby party session show code for party
      chrome.tabs.sendMessage(activeTab.id, { content: "already-connected" });
    });
  }

  createParty = () => {
    // inject script into current tab
    const self = this;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      // check if the page is an emby page itself
      chrome.tabs.executeScript(activeTab.id, code, function (resp) {
        if (!self.hasResponse(resp) || !resp[0]) {
          // cannot create party for this page
          self.setHeader("This page as no video to share :(");
          self.setView();
        } else {
          // page is injectable so inject content script
          chrome.tabs.executeScript(activeTab.id, script, function (resp) {
            if (self.hasResponse(resp)) {
              chrome.tabs.sendMessage(activeTab.id, {
                content: "create-party",
              });
            } else {
              self.setHeader("You cannot create a party for this page");
              self.setView();
            }
          });
        }
      });
    });
  };

  // join party is handled in a different manner as it gets
  // the link to the party and then opens a new tab
  joinParty = (partyId) => {
    if (partyId) {
      const endpoint = "/party/" + partyId;

      // tries to join the party
      fetch(apiServer + endpoint)
        .then((resp) => resp.json())
        .then((resp) => {
          if (this.hasError(resp)) {
            this.handleError(resp);
          } else {
            // dereference the data object to ensure their is no potentially bad data
            var { url, partyId } = resp.data;
            // sends a message to background script
            // this will in turn open a new tab and execute the script in it
            chrome.runtime.sendMessage(null, {
              background: "join-party",
              data: { url, partyId },
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.handleError(err);
        });
    }
  };

  render() {
    return (
      <div className="App">
        <div className="App-header" display="block">
          <img src={logo} className="App-icon" alt="Emby Party" />
          <h1>Emby Party</h1>
        </div>
        <p className="App-info">{this.state.headerInfo}</p>
        <div className="App-view">{this.state.view()}</div>
      </div>
    );
  }

  defaultView = () => (
    <>
      <button className="App-button" onClick={this.createParty}>
        Create Party
      </button>
      <button
        className="App-button"
        onClick={() => {
          this.setView(this.joinView);
        }}
      >
        Join Party
      </button>
    </>
  );

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    this.setState({ copyState: true });
  };

  connectedView = () => (
    <>
      <OTPOutput
        numOutputs={6}
        output={this.state.partyId}
        submitButton={
          <button className="App-button">
            {this.state.copyState ? "Copied" : "Copy to clipboard"}
          </button>
        }
        onSubmit={(partyId) => this.copyToClipboard(partyId)}
      />
    </>
  );

  joinView = () => (
    <>
      <OTPInput
        numInputs={6}
        submitButton={<button className="App-button">Join Party</button>}
        onSubmit={(partyId) => this.joinParty(partyId)}
      />
    </>
  );
}

export default App;
