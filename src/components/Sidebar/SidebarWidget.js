import { Component } from "react";

import Draggable from "react-draggable";

import { EmbyIcon } from "./Icons";

class SidebarWidget extends Component {
  static defaultProps = {
    onClick: () => {
      console.log("widget clicked");
    },
    defaultStyle: {
      position: "fixed",
      display : 'block',
      top: "30vh",
      right: "20vw",
      opacity : 1,
      transition: "all 0.25s ease 0s",
    },
  };

  state = {
    dragging: false,
  };

  onDrag = () => {
    this.setState({ dragging: true });
  };

  onStop = () => {
    const { dragging } = this.state;
    this.setState({ dragging: false });
    if (!dragging) {
      this.props.onClick();
    }
  };

  render() {
    return (
      <div style={{ zIndex: 2147483647, position: "fixed", width: "100vw", height: "100vh" }}>
        <Draggable bounds="parent" onDrag={this.onDrag} onStop={this.onStop}>
          <div
            style={{ ...this.props.defaultStyle, ...this.props.style }}
          >
            <EmbyIcon />
          </div>
        </Draggable>
      </div>
    );
  }
}

export default SidebarWidget;
