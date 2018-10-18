import React from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

let myVar = 0;

import { resizeHChart, findAncestor, debounce } from "../commonFns";

export class TemplateChart extends React.Component {
  constructor() {
    super();
    this.state = { data: [] };
    myVar = setInterval(
      () => this.setState({ data: [...Array(3)].map(Math.random) }),
      6500
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

    /*
        To Dos:
    
        Module the GridItem Content
        save layout
        Grid Item Uniqueness
    
        */

    const { type } = this.props;
    //return <p props={this.props}>{templateType} </p>;

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
          }
        }}
      />
    );
  }
}
