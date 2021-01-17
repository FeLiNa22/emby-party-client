import { Component } from "react";

class SidebarCollapseBtn extends Component {
  static defaultProps = {
    onClick: () => console.log("sidebar collapse button clicked"),
  };

  render() {
    return (
      <button
        style={{
          top: 0,
          left: 0,
          padding: "20px",
        }}
        onClick={this.props.onClick}
      >
        <i class="fa fa-close"></i>
      </button>
    );
  }
}


export default SidebarCollapseBtn;