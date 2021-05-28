import { Component } from "react";

import "./Sidebar.css";

const state = {
  OPENED: "",
  CLOSED: "collapsed",
};

class Sidebar extends Component {
  state = {
    sidebarState: state.OPENED,
  };

  show = () => {
    this.setState({ sidebarState: state.OPENED });
  };

  hide = () => {
    this.setState({ sidebarState: state.CLOSED });
  };

  render = () => {
    return (
      <div className={"Sidebar " + this.state.sidebarState}>
        <div className="Sidebar-header">{this.props.header}</div>
        <div className="Sidebar-body">{this.props.body}</div>
        <div className="Sidebar-footer">{this.props.footer}</div>
      </div>
    );
  };
}

export default Sidebar;
