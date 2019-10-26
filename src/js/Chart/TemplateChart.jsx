import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { resizeHChart, pieRandomData } from "../commonFns";

export class TemplateChart extends React.Component {
  state = {
    refreshRate: 1000,
    data: (function() {
      // generate an array of random data
      var data = [],
        time = new Date().getTime(),
        i;

      for (i = -19; i <= 0; i += 1) {
        data.push({
          x: time + i * 1000,
          y: Math.random()
        });
      }
      return data;
    })()
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
            animation: true,
            events: {
              load: function() {}
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

// https://www.highcharts.com/blog/post/highcharts-react-wrapper-dashboard/

// bar chart
// https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data/livedata-columns
// https://codesandbox.io/s/v318454060?from-embed
// set up the updating of the chart each second
// https://www.highcharts.com/demo/dynamic-update
