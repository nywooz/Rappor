import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { agents: 0 };
    this.addChildItem = this.addChildItem.bind(this);
  }

  addChildItem() {}

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <input name="search" />

          <span>show selected</span>
          <span>edit</span>
          <span>delete</span>
          <span>sort by Name ascending</span>
          <span>gallery</span>
          <span>list</span>
        </div>

        <div className="row">
          <div className="col-10" style={style}>
            <AddRemoveLayout ref={this.canvasRef} />
          </div>

          <div className="col-2" style={style} />
        </div>
      </div>
    );
  }
}
