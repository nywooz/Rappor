// var connection = new WebSocket("ws://html5rocks.websocket.org/echo", [
//   "soap",
//   "xmpp"
// ]);

import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.outputRef = React.createRef();
    this.addChildItem = this.addChildItem.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  addChildItem() {}

  componentDidMount() {
    this.init_websocket();
  }

  init_websocket() {
    var serviceUrl = "ws://echo.websocket.org/";
    var protocol = "Chat-1.0";
    // let websocket = new WebSocket(serviceUrl, protocol);
    this.websocket = new WebSocket(serviceUrl);

    //  allows you to know when the connection is opened
    this.websocket.onopen = function() {
      outputEl.innerHTML += "<p style='color: green;'>> CONNECTED</p>";
    };

    // the server send us messages at any time
    this.websocket.onmessage = evt =>
      (outputEl.innerHTML +=
        "<p style='color: blue;'>> RESPONSE: " + evt.data + "</p>");

    this.websocket.onerror = function(evt) {
      outputEl.innerHTML +=
        "<p style='color: red;'>> ERROR: " + evt.data + "</p>";
    };
  }

  handleKeyPress(event) {
    if (event.target.value) {
      let val = event.target.value;
      if (event.key == "Enter") {
        // enter
        this.sendMessage(val);
        event.target.value = null;
      }
    }
  }

  sendMessage(message) {
    outputEl.innerHTML += "<p>> SENT: " + message + "</p>";
    this.websocket.send(message);
  }

  render() {
    return (
      <div>
        <p>web socket sample</p>
        <input type="text" onKeyPress={this.handleKeyPress} />
        <div ref={this.outputRef} id="output" />
      </div>
    );
  }
}

// const rootEl = document.getElementById("websockethtml5");
// ReactDOM.render(<App />, rootEl);

const outputEl = document.getElementById("outputhtml5");
