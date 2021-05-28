import { Component } from "react";
import './SidebarCollapseButton.css';

class SidebarCollapseBtn extends Component {
  static defaultProps = {
    onClick: () => console.log("sidebar collapse button clicked"),
  };

  render() {
    return (
      <button
        className="Sidebar-collapse-button"
        onClick={this.props.onClick}
      >
        &times;
      </button>
    );
  }
}


export default SidebarCollapseBtn;