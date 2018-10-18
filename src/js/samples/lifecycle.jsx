import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class caller extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }


  componentDidMount() {
    debugger;
  }

  componentDidUpdate() {
    debugger;

  }

  componentWillUnmount() {
    // clean up the mess
    debugger;
  }


  render() {      
    return (
    <p>Modal callback</p>
    );
  }
}
