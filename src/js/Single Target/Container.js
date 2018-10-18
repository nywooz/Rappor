import React, { Component } from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Dustbin from "./Dustbin";
import Toolbox from "./Toolbox";

const icon_div_style = {
  margin: "10px",
  width: "fit-content",
  background: "#eaeaea"
};

export default class Container extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          <div style={{ overflow: "hidden", clear: "both" }}>
            <Dustbin />
          </div>
          <div style={{ overflow: "hidden", clear: "both" }}>
            <Box name="Glass" />
            <Box name="Banana" />
            <Box name="Paper" />
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

// const Icons = [
//   "fa-chart-pie",
//   "fa-chart-line",
//   "fa-chart-bar",
//   "fa-chart-area",
//   "fa-font"
// ];
// {Icons.map((item, i) => {
//   return (
//     <Box name="Glass">
//       <div style={icon_div_style}>
//         <i className="fas fa-chart-pie fa-3x" />
//       </div>
//     </Box>
//   );
// })}
