import { Component } from "react";

import SidebarWidget from "../../components/Sidebar/SidebarWidget";
import Sidebar from "./SidebarChat";
import "./App.css";

/* Inject Sidebar and Sidebar toggler */
class App extends Component {
  static defaultProps = {
    style: {
      position: "fixed",
      top: 0,
      right: 0,
      height: "100vh",
      width: "400px",
      transition: "all 0.2s ease 0s",
      zIndex: 2147483647,
    },
  };

  state = {
    isVisible: false,
  };

  componentDidMount() {
    // inject smooth transition sequence
    document.body.style.transition = "all 0.2s ease 0s";

    this.registerChromeEventListeners();
    // onces mounted sets visibilty to true
    this.toggleVisibility();
  }

  registerChromeEventListeners = () => {
    const self = this; // to deal with scoping issues
    // register chrome event listener to deal with messages from the popup
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      console.log(message);
      if (message && message.content) {
        switch (message.content) {
          case "create-party":
            // try and create the party
            // get the url of the video tag
            var list = document.getElementsByTagName("VIDEO");
            if (list.length > 0) {
              var vid_elem = list[0];
              console.log(vid_elem);
              self.sidebarRef.user.createParty(vid_elem.src, (resp) =>
                chrome.runtime.sendMessage(null, {
                  popup: "joined-party",
                  ...resp,
                })
              );
            } else {
              chrome.runtime.sendMessage(null, {
                popup: "joined-party",
                error: {message : "There is no video to share on this page"},
              });
            }
            break;

          case "join-party":
            // try and join the party
            self.sidebarRef.user.joinParty(message.data.partyId, (resp) =>
              chrome.runtime.sendMessage(null, {
                popup: "joined-party",
                ...resp,
              })
            );
            break;

          case "already-connected":
            // check if already connected to a room
            if (self.sidebarRef.user.partyId) {
              chrome.runtime.sendMessage(null, {
                popup: "joined-party",
                data: { partyId: self.sidebarRef.user.partyId },
              });
            }
            break;
          default:
            break;
        }
      }
    });
  };

  toggleVisibility = () => {
    this.setState((prevState) => {
      if (prevState.isVisible) {
        // pushes all of body to the right
        document.body.style.marginRight = 0;
      } else {
        // pushes all of body to the left
        document.body.style.marginRight = this.props.style.width;
      }
      return { isVisible: !prevState.isVisible };
    });
  };

  render() {
    return (
      <>
        <SidebarWidget
          onClick={this.toggleVisibility}
          style={{
            visibility: this.state.isVisible ? "hidden" : "visible",
            opacity: this.state.isVisible ? 0 : 1,
          }}
        />
        <div
          style={{
            ...this.props.style,
            right: this.state.isVisible ? 0 : "-" + this.props.style.width,
          }}
        >
          <Sidebar
            ref={(ref) => (this.sidebarRef = ref)}
            onToggle={this.toggleVisibility}
          />
        </div>
      </>
    );
  }
}

export default App;
