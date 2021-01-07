/*global chrome*/

import SidebarWidget from "./components/Sidebar/SidebarWidget";
import { Component } from "react";
import ReactDOM from "react-dom";

/* Inject Sidebar and Sidebar toggler */
class Injectable extends Component {
  static defaultProps = {
    title: "iframe",

    style: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      height: "100vh",
      width: "400px",
      transition: "all 0.2s ease 0s",
      zIndex: 999999,
    },

    src: chrome.runtime.getURL("/sidebar.html"),
  };

  state = {
    isVisible: false,
  };

  componentDidMount() {
    // onces mounted sets visibilty to true
    this.toggleVisibility();
  }

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
            opacity : this.state.isVisible ? 0 : 1,
          }}
        />
        <div
          style={{
            ...this.props.style,
            right: this.state.isVisible ? 0 : '-' + this.props.style.width ,
          }}
        >
          <iframe
            title={this.props.title}
            src={this.props.src}
            style={{ width: "100%", height: "100%" }}
          />
          <button
            style={{
              visibility: this.state.isVisible ? "visible" :  "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              padding: "20px",
            }}
            onClick={this.toggleVisibility}
          ><i class="fa fa-close"></i></button>
        </div>
      </>
    );
  }
}

let injectSidebar = () => {
  const injection = document.createElement("div");

  // injects the sidebar into the page
  document.body.appendChild(injection);

  // render component
  ReactDOM.render(<Injectable />, injection);
};

injectSidebar();
