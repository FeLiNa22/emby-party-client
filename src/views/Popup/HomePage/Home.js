"use strict";

import { Component } from "react";
import "./../App.css";
import logo from "../../../assets/emby.png";

export class Home extends Component {
  state = { error: null };

  constructor(props) {
    super(props);
    const { onCreateClicked, onJoinClicked } = props;
  }

  render = () => {
    return (
      <>
        <div className="App-header" display="block">
          <img src={logo} className="App-icon" alt="Emby Party" />
          <h1 style={{margin : "5px auto"}}>Emby Party</h1>
        </div>
        <p className="App-info">Start watching movies together</p>
        <div className="App-view">
          <button className="App-button" onClick={this.props.onCreateClicked}>
            Create Party
          </button>
          <button className="App-button" onClick={this.props.onJoinClicked}>
            Join Party
          </button>
        </div>
      </>
    );
  };
}
