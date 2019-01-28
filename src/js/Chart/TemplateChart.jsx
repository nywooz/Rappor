import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { resizeHChart } from "../commonFns";
let myVar = 0;

export class TemplateChart extends React.Component {
  constructor() {
    super();
    this.state = { data: [] };
    myVar = setInterval(
      () => this.setState({ data: [...Array(3)].map(Math.random) }),
      3000
    );
  }

  componentDidMount() {
    const ref_HighChart = this.ref_HighChart;
    resizeHChart(ref_HighChart);
  }

  componentWillUnmount() {
    clearInterval(myVar);
  }

  render() {
    resizeHChart(this.ref_HighChart);

    const cb = function() {};

    const { type } = this.props;

    return (
      <HighchartsReact
        ref={chart => {
          this.ref_HighChart = chart;
        }}
        highcharts={Highcharts}
        options={{
          series: [{ data: this.state.data }],
          chart: {
            type: type,
            animation: true,
            events: { load: cb }
          },
          credits: {
            enabled: false
          }
        }}
      />
    );
  }
}
