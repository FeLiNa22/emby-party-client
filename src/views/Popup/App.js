"use strict";

import React, { Component } from "react";
import "./App.css";

import { Home } from "./HomePage/Home";
import { Join } from "./JoinPage/Join";
import { Connected } from "./ConnectedPage/Connected";
import { Error } from "./ErrorPage/Error";
import { PopupHandler } from "../../controllers/PopupHandler";

class App extends Component {
  controller;
  static_home;
  state;

  constructor(props) {
    super(props);

    // intialise controller object
    this.controller = new PopupHandler();

    // home view is static component so
    // it can be pre-rendered
    this.static_home = (
      <Home
        onCreateClicked={() => this.controller.createParty(this.onCreatedParty)}
        onJoinClicked={this.switchToJoinPage}
      />
    );

    this.static_join = (
      <Join
        ref={(ref) => (this.joinRef = ref)}
        onJoinPartyClicked={(partyId) =>
          this.controller.joinParty(partyId, this.onJoinedParty)
        }
      />
    );

    // initial state
    this.state = {
      view: this.static_home,
    };
  }

  onCreatedParty = (party) => {
    if (!party.error) {
      // if party created succesfully
      this.setState({ view: <Connected party={party} /> });
    } else {
      // if party failed to be created
      this.setState({
        view: (
          <Error
            error={party.error}
            tryAgain={() => this.setState({ view: this.static_home })}
          />
        ),
      });
    }
  };

  onJoinedParty = (party) => {
    if (!party.error) {
      // if party joined/created succesfully
      this.setState({ view: <Connected party={party} /> });
    } else {
      if (party.code === 100) {
        // if party doesnt exist just send error to join view
        this.joinRef.setState({ error: party.error });
      } else {
        // if failed to join party
        this.setState({
          view: (
            <Error
              error={party.error}
              tryAgain={() => this.setState({ view: this.static_join })}
            />
          ),
        });
      }
    }
  };

  switchToJoinPage = () => {
    this.setState({ view: this.static_join });
  };

  componentDidMount = () => {
    // check if tab has already established a connection
    this.controller.getParty((party) => {
      if (!party.error) {
        this.setState({ view: <Connected party={party} /> });
      }
    });
  };

  render() {
    return <div className="App">{this.state.view}</div>;
  }
}

export default App;
