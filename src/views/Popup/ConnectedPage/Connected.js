"use strict";

import { Component } from "react";
import "./../App.css";
import OTPOutput from "../../../components/OTP/OTPOutput";

export class Connected extends Component {
  state = {
    copyState: false,
  };

  constructor(props) {
    super(props);
    const { party } = props;
    console.log(party);
    const { id, video, members } = party;
    this.partyId = id;
    this.video = video ? video.name : "Nothing";
    this.members = members.map((member) => (
      <li class={"member"}>{member.name}</li>
    ));
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    this.setState({ copyState: true });
  };

  render = () => {
    return (
      <>
        <div className="App-view left">
          <h1 style={{ display: "inline-block" }} class={"highlight"}>
            Currently Watching :
          </h1>{" "}
          <h1 style={{ display: "inline-block" }} class={"video-title"}>
            {this.video}
          </h1>
        </div>

        <div className="App-view">
          <p class={"code-info"} style={{ "margin": "10px auto" }}>
            Share the CODE below with others. 
            The recipient(s) can then join the party using the Emby Party extension.
          </p>
          <OTPOutput
            numOutputs={6}
            output={this.partyId}
            submitButton={
              <button className="App-button" style={{ width: "90%" }}>
                {this.state.copyState ? "Copied" : "Copy to clipboard"}
              </button>
            }
            onSubmit={(partyId) => this.copyToClipboard(partyId)}
          />
        </div>

        {/* list all members here */}
        <div className="App-view left">
          <h1 class={"highlight"}>Members</h1>
          <ul style={{ "list-style-type": "none", "padding-left": 0 }}>
            {this.members}
          </ul>
        </div>
      </>
    );
  };
}
