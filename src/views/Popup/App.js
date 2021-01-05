import React, {Component} from 'react';

import Sidebar from '../../content.js';

import PartyConnect from './createParty.js';

import './App.css';

class App extends Component {
  render(){
    return (

      <div className="App">
       <Sidebar />
       <PartyConnect />
      </div>
    );
  }
}


export default App
