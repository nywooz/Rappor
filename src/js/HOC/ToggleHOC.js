import React, { Component } from "react";
import ReactDOM from "react-dom";

// https://medium.com/@onoufriosm/real-world-examples-of-higher-order-components-hoc-for-react-871f0d8b39d8
const withToggle = PassedComponent =>
  class WithToggle extends React.Component {
    state = {
      toggleStatus: false
    };
    constructor() {
      super();
      this.toggle = this.toggle.bind(this);
    }
    toggle() {
      this.setState({
        toggleStatus: !this.state.toggleStatus
      });
    }
    render() {
      return (
        <PassedComponent
          {...this.props}
          toggle={this.toggle}
          toggleStatus={this.state.toggleStatus}
        />
      );
    }
  };

export default withToggle;
