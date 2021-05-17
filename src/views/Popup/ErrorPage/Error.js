'use strict';

import { Component } from "react";
import "./../App.css";

export class Error extends Component {
  
    constructor(props) {
    super(props);
    const { error, tryAgain } = props;
    this.tryAgain = tryAgain;
    this.error = error;
  }

  render = () => {
    return (
      <>
        <button className="App-button" onClick={this.tryAgain}>Try Again</button>
        <p className="error" style={{textAlign : "center"}}>{this.error}</p>
      </>
    );
  };

}
