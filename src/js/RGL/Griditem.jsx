import React from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Highchart1 from "../Chart/Demo/HighChart";
import Highchart2 from "../Chart/Demo/HighChart2";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { data: [] };
  }

  render() {
    const removeStyle = {
      // // position: "absolute",
      // right: "5px",
      // // top: 0,
      // // cursor: "pointer"
      //  marginLeft: "auto",
      // marginRight: "5px"
    };

    const contentStyle = {
      background: "#e3cdcd",
      width: "100%",
      height: "100%"
    };
    const { i, el } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-10">
            {i} {el.name && el.name != i ? " " + el.name : ""}
          </div>
          <div
            className="col-2"
            style={removeStyle}
            onClick={this.props.onRemoveItem.bind(this, i)}
          >
            x
          </div>
        </div>

        <div className="row" style={contentStyle}>
          {el.add ? (
            <div
              className="add text"
              onClick={this.onAddItem}
              title="You can add an item by clicking here, too."
            >
              Add +
            </div>
          ) : (
            <div style={contentStyle}>
              <Highchart1 />
            </div>
          )}
        </div>
      </div>
    );
  }
}
