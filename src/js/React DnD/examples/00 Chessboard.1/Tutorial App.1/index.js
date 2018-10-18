import ReactDOM from "react-dom";
import React, { Component } from "react";
import Board from "./Board";
import { observe } from "./Game";

export default class ChessboardTutorialApp extends Component {
  render() {
    return (
      <div
        style={{
          width: 500,
          height: 500,
          border: "1px solid gray"
        }}
      >
        <Board knightPosition={[7, 4]} />
      </div>
    );
  }
}
