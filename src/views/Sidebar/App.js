import { Component } from "react";

import SidebarWidget from "../../components/Sidebar/SidebarWidget";
import Sidebar from "./Sidebar";
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
    }
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
          <Sidebar onToggle={this.toggleVisibility}/>
        </div>
      </>
    );
  }
}


export default App;
