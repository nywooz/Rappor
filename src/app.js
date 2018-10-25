import React from "react";
import ReactDOM from "react-dom";

import { combineReducers, createStore } from "redux";
import { Provider } from "react-redux";

import productsReducer from "./js/reducers/product-reducer";
import userReducer from "./js/reducers/user-reducer";

require("babel-polyfill");
import "bootstrap";
import "./css/react-grid-layout.css";
import "./css/react-grid-layout-custom.css";


// import 'bootstrap/js/dist/util';
// import 'bootstrap/js/dist/dropdown';

//import RDnD from "./React DnD/examples/00 Chessboard.1/Tutorial App.1/index";
//import RDnD from "./React DnD/examples/00 Chessboard.1/Tutorial App.1/index";

const rootEl = document.getElementById("root");

// import Board from "./js/React DnD/examples/00 Chessboard.1/Tutorial App.1/Board";
// import { observe } from "./js/React DnD/examples/00 Chessboard.1/Tutorial App.1/Game";

// observe(knightPosition =>
//   ReactDOM.render(<Board knightPosition={knightPosition} />, rootEl)
// );

import Skeleton from "./js/RGL/Skeleton";
ReactDOM.render(<Skeleton />, rootEl);

// import Container from "./js/Single Target/Container";
// ReactDOM.render(<Container />, rootEl);

// // https://css-tricks.com/what-are-higher-order-components-in-react/
// import HOC from "./js/HOC/example1";
// ReactDOM.render(<HOC name="HOC" />, rootEl);

import ViewEditToggleExample from "./js/HOC/ViewEditToggleExample";

ReactDOM.render(
  <ViewEditToggleExample title="My first HOC Component" />,
  document.getElementById("appHoc")
);
