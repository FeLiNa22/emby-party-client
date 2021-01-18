import React, { Component } from "react";

import "./App.css";
import Sidebar from '../Sidebar/App'
import VideoPlayer from './VideoPlayer'

class App extends Component {

  render() {
    return (
      <>
        <VideoPlayer />
        <Sidebar />
      </>
    );
  }
}

export default App;
