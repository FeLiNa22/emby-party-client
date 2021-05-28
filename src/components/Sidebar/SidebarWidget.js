import { Component } from "react";

import Draggable from "react-draggable";

import { EmbyIcon } from "./Icons";

import "./SidebarWidget.css";

const state = {
  SHOWN: "shown",
  HIDDEN: "hidden",
  HIDING: "hiding",
};

class SidebarWidget extends Component {
  state = {
    dragging: false,
    hiddenState: state.HIDDEN,
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

  hideSlowly = () => {
    this.setState({ hiddenState: state.HIDING });
  };

  showImmediately = () => {
    this.setState({ hiddenState: state.SHOWN });
  };

  hideImmediately = () => {
    this.setState({ hiddenState: state.HIDDEN });
  };

  render() {
    return (
      <div className="Sidebar-widget-container">
        <Draggable bounds="parent" onDrag={this.onDrag} onStop={this.onStop}>
          <div className={"Sidebar-widget " + this.state.hiddenState}>
            <EmbyIcon />
          </div>
        </Draggable>
      </div>
    );
  }
}

export default SidebarWidget;
