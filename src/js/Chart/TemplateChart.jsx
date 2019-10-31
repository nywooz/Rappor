import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { resizeHChart, pieRandomData, LineRandomData } from "../commonFns";

export class TemplateChart extends React.Component {
  state = {
    refreshRate: 1000,
    data: LineRandomData()
  };

  componentDidMount() {
    const chart = this.ref_HighChart.chart;
    // HC Events
    chart.hcEvents.load = this.addSeries(chart);
    // chart.hcEvents.destroy =this.
    // chart.hcEvents.endResize=this.
    // chart.hcEvents.resize=this.
  }

  componentWillUnmount() {
    this.ref_HighChart &&
      this.ref_HighChart.destroy &&
      this.ref_HighChart.destroy();
    clearInterval(this.intervalId);
  }

  // shift if the series is longer than 25(default)
  boolShift(series, length = 25) {
    return series && series.data.length > 25;
  }

  addSeries(chart) {
    const series = chart.series[0];
    const chartType = this.props.type;
    const shiftableCharts = [
      // "pie",
      "line",
      // "bar",
      "area",
      "spline",
      "areaspline"
    ];

    shiftableCharts.includes(chartType)
      ? this.addPoint(chartType, series, true)
      : this.addPoint(chartType, series);

    resizeHChart(chart);
  }

  // set up the updating of the chart each second
  addPoint(chartType, series, addPt) {
    if (addPt) {
      this.intervalId = setInterval(() => {
        const x = new Date().getTime(); // current time   new Date().toLocaleTimeString()
        const y = Math.random();
        series && series.addPoint([x, y], true, this.boolShift(series));
      }, this.state.refreshRate);
    } else {
      this.intervalId = setInterval(() => {
        // https://api.highcharts.com/class-reference/Highcharts.Series
        // setData(data [, redraw] [, animation] [, updatePoints])
        series.setData(pieRandomData(), true, true, true);
      }, this.state.refreshRate);
    }
  }

  render() {
    resizeHChart(this.ref_HighChart);

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

            options3d: {
              enabled: true,
              alpha: 45
            },

            animation: true,
            events: {
              // covered by  chart.hcEvents.load
              load: function() {}
            }
          },

          plotOptions: {
            pie: {
              innerSize: 200,
              depth: 45
            }
          },

          title: {
            text: "Live Data Sample"
          },
          credits: {
            enabled: false
          }
        }}
      />
    );
  }
}

// https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/3d-pie-donut/
// https://www.highcharts.com/docs/chart-and-series-types/chart-types
// https://www.highcharts.com/blog/post/highcharts-react-wrapper-dashboard/

// bar chart
// https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data/livedata-columns
// https://codesandbox.io/s/v318454060?from-embed
// set up the updating of the chart each second
// https://www.highcharts.com/demo/dynamic-update
