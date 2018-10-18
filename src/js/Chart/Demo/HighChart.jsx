import React from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
let myVar = 0;

import { resizeHChart, findAncestor, debounce } from "../../commonFns";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { data: [] };
    myVar = setInterval(
      () => this.setState({ data: [...Array(3)].map(Math.random) }),
      1500
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
    const { templateType } = this.props;

    const cb = function() {};
    return (
      <HighchartsReact
        ref={chart => {
          this.ref_HighChart = chart;
        }}
        highcharts={Highcharts}
        options={{
          chartHeight: "100%",
          innerSize: "50%",

          series: [{ data: this.state.data }],
          chart: {
            type: templateType,
            animation: true,
            events: { load: cb }
          }
        }}
      />
    );
  }
}
