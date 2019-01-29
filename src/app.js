import React, { Component } from "react";

import "./css/react-grid-layout.css";
import "./css/react-grid-layout-custom.css";

import RGL from "./js/Dynamic-add-remove";
import Index from "./js/materialUI/MaterialUITest";
import SignIn from "./js/materialUI/SignIn";
import Dashboard from "./js/materialUI/dashboard/Dashboard";

class App extends Component {
  render() {
    return <Dashboard />;
  }
}

export default App;
