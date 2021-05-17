"use strict";

import { Component } from "react";
import "./../App.css";
import OTPInput from "../../../components/OTP/OTPInput";
export class Join extends Component {
  constructor(props) {
    super(props);

    const { onJoinPartyClicked } = props;
    this.onJoinPartyClicked = onJoinPartyClicked;
    this.state = {
      error: null,
    };
  }

  clearErrors = () => {
    this.setState({ error: null });
  };

  render = () => {
    return (
      <>
        <div className="App-view">
          <p class={"code-info"} style={{ margin: "10px auto" }}>
            Get the code for the party you would like to join, any member of the
            party will be able to share this with you. You can then join the
            party by pasting the code below, and clicking join.
          </p>
          <OTPInput
            numInputs={6}
            submitButton={
              <button style={{ width: "90%" }} className="App-button">
                Join Party
              </button>
            }
            onChange={this.clearErrors}
            onSubmit={(partyId) => this.onJoinPartyClicked(partyId)}
          />
          {this.state.error ? (
            <p className="error">{this.state.error}</p>
          ) : null}
        </div>
      </>
    );
  };
}
