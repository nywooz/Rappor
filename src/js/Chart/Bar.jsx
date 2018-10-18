import React, { Component } from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require("highcharts/modules/exporting")(Highcharts);

const dummyoptions = {
  title: {
    text: "Chart.update"
  },

  subtitle: {
    text: "Plain"
  },

  xAxis: {
    categories: ["Jan", "Feb", "Mar", "Apr"]
  },
  chart: {
    type: "column"
  },

  series: [
    {
      colorByPoint: true,
      data: [29.9, 71.5, 106.4, 129.2],
      showInLegend: false
    }
  ]
};

class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highchartAPI: null
    };
    // this.createChartCallback = this.createChartCallback.bind(this);
  }

  //   shouldComponentUpdate(nextProps, nextState) {
  //     console.log("Should update Highchart fired");

  //     return this.props ? true : false;

  //     //  Skips render() if returns false, defaults to true
  //     // fires before rendering with new props or state
  //   }

  //   componentDidMount() {
  //     // const seriesData = this.props.options.series.map(item => item.data);
  //     // const dataArr = seriesData.map(item => item.length > 0);

  //     // const foundValidData = dataArr.find(function(element) {
  //     //   return element === true;
  //     // });

  //     // if (foundValidData) {
  //     //   // const options = this.cook_Chart(this.props.options);
  //     // }

  //     if (this.highchartsComponent) {
  //       this.highchartsComponent.chart.hcEvents.onload = this.loadedChart();
  //     }
  //   }

  //   loadedChart() {
  //     var label = this.highchartsComponent.chart.renderer
  //       .label("Chart loaded", 100, 120)
  //       .attr({
  //         fill: Highcharts.getOptions().colors[0],
  //         padding: 10,
  //         r: 5,
  //         zIndex: 8
  //       })
  //       .css({
  //         color: "#FFFFFF"
  //       })
  //       .add();

  //     setTimeout(function() {
  //       label.fadeOut();
  //     }, 1000);
  //   }

  //   createChartCallback(chartAPI) {
  //     this.setState({ highchartAPI: chartAPI });
  //     // debugger;
  //     chartAPI.hcEvents.onload = function() {
  //       alert("fully loaded");
  //     };
  //   }

  //I’ve stored a reference to that element on the component instance using a ref ( highchartsComponent )

  render() {
    var self = this;
    const { columns, data, options } = this.props;

    if (!options && !dummyoptions) {
      return <div>Loading {this.constructor.name} Chart ...</div>;
    } else {
      return (
        <div className="highcharts-root">
          <div className="highcharts-container">
            <HighchartsReact
              ref={highchartsComponent =>
                (this.highchartsComponent = highchartsComponent)
              }
              callbackFromParent={this.createChartCallback}
              highcharts={Highcharts}
              options={dummyoptions}
            />
          </div>
        </div>
      );
    }
  }
}

export default Bar;
