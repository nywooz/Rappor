import React, { Component } from "react";
import ReactDOM from "react-dom";

import Bar from "./Bar";
import Pie from "./Pie";
import Line from "./Line";

export default class ChartWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {
    // clean up the mess
  }

  render() {
    const { data, columns, options } = this.props;

    return data.length > 0 ? (
      <div>
        <p>ChartWrapper</p>

   
        <Bar data={data} columns={columns} options={options} />
        <Pie data={data} columns={columns} options={options} />
        <Line data={data} columns={columns} options={options} />
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}
