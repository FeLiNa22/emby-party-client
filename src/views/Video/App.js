import React, { Component } from "react";
import "./App.css";
import VideoPlayer from "./VideoPlayer";

class App extends Component {
  
  componentDidMount() {
    const script = document.createElement("script");
    script.async = true;
    script.src = "content.js";
    document.head.appendChild(script);
  }
  
  render() {
    return (
      <>
        <VideoPlayer />
      </>
    );
  }
}

export default App;
