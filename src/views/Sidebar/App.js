import { Component } from "react";

import SidebarWidget from "../../components/Sidebar/SidebarWidget";
import SidebarCollapseBtn from "../../components/Sidebar/SidebarCollapseBtn";
import Sidebar from "../../components/Sidebar/Sidebar";
import SidebarChat from "./SidebarChat";
import Donate from "../../components/Sidebar/Donate";
import "./App.css";
import { SidebarController } from "../../controllers/SidebarController";

const WIDTH = "400px";

class App extends Component {
  state = {
    isCollapsed: false,
  };

  constructor(props) {
    super(props);
    const { member } = props;
    this.controller = new SidebarController(member);
  }

  componentDidMount() {
    // inject smooth transition sequence
    document.body.style.transition = "all 0.2s ease 0s";
    // inject listeners for the widget
    document.addEventListener("mousemove", this.showWidgetForSomeTime);
    document.addEventListener("mousedown", this.showWidgetForSomeTime);
  }

  toggleSidebar = () => {
    this.setState((prevState) => {
      var isCollapsed = !prevState.isCollapsed;
      if (isCollapsed) {
        // sets body margin back to default
        document.body.style.marginRight = 0;
        // close the sidebar
        this.sidebarRef.hide();
        // show the widget
        this.widgetRef.showImmediately();
      } else {
        // pushes all of body to the left
        document.body.style.marginRight = WIDTH;
        // open the sidebar
        this.sidebarRef.show();
        // hide the widget
        this.widgetRef.hideImmediately();
      }
      return { isCollapsed };
    });
  };

  showWidgetForSomeTime = () => {
    if (this.state.isCollapsed) {
      clearTimeout(this.timeout);
      this.widgetRef.showImmediately();
      this.timeout = setTimeout(this.widgetRef.hideSlowly, 1000);
    }
  };

  render() {
    return (
      <>
        <SidebarWidget
          ref={(ref) => (this.widgetRef = ref)}
          onClick={this.toggleSidebar}
        />
        <Sidebar
          ref={(ref) => (this.sidebarRef = ref)}
          header={
            <>
              <SidebarCollapseBtn onClick={this.toggleSidebar} />
              <button
                className="Sidebar-leave-party-button"
                onClick={this.controller.leaveParty}
              >
                Leave
              </button>
            </>
          }
          body={<SidebarChat controller={this.controller} />}
          footer={<Donate />}
        />
      </>
    );
  }
}

export default App;
