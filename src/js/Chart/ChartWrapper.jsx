import React, { Component } from "react";
import ReactDOM from "react-dom";

// C: \Repos_WEST\Reports\src\js\WebSocket.1\InboundLiveStatus.js
import { InboundLiveStatusTable } from "../WebSocket.1/InboundLiveStatus";
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

        <InboundLiveStatusTable
          data={data}
          columns={columns}
          options={options}
        />

        <Bar data={data} columns={columns} options={options} />
        <Pie data={data} columns={columns} options={options} />
        <Line data={data} columns={columns} options={options} />
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}
