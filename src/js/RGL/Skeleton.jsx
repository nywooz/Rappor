import React, { Component } from "react";
import ReactDOM from "react-dom";

import AddRemoveLayout from "./Dynamic-add-remove.2";

import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Dustbin from "../Single Target/Dustbin";
import Toolbox from "../Single Target/Toolbox";
import HTMLDnD from "../HTML5 DnD";

const style = { overflow: "hidden", clear: "both" };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isHTMLDnDToggleOn: false };
    this.boxRef = React.createRef();
    this.canvasRef = React.createRef();
    this.addChildItem = this.addChildItem.bind(this);
  }

  addChildItem(name) {
    const box = this.boxRef.current;
    const canvasRef = this.canvasRef.current;
    canvasRef.onAddItem(name);
  }

  toggleDnDApi(e) {
    e.preventDefault();
    this.setState(prevState => ({
      isHTMLDnDToggleOn: !prevState.isHTMLDnDToggleOn
    }));
  }

  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-10" style={style}>
              <AddRemoveLayout ref={this.canvasRef} />
            </div>

            <div className="col-2" style={style} />
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

const icons = [
  "fa-chart-pie",
  "fa-chart-line",
  "fa-chart-bar",
  "fa-chart-area",
  "fa-font",
  "fa-image",
  "fa-list",
  "fa-table",
  "fa-tachometer-alt",
  "fa-layer-group"
];

export const iconsTypeMap = {
  "fa-chart-pie": "pie",
  "fa-chart-line": "line",
  "fa-chart-bar": "bar",
  "fa-chart-area": "area",

  "fa-font": "text",
  "fa-image": "image",
  "fa-list": "list",
  "fa-table": "table",
  "fa-tachometer-alt": "tachometer",
  "fa-layer-group": "carousel"
};
