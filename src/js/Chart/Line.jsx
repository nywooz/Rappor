import React, { Component } from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require("highcharts/modules/exporting")(Highcharts);

const dummyoptions = {
  title: {
    text: "Browser market shares in January, 2018"
  },

  subtitle: {
    text: "Plain"
  },

  chart: {
    type: "line"
  },
  yAxis: {
    title: {
      text: "Number of Employees"
    }
  },
  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "middle"
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      },
      pointStart: 2010
    }
  },

  series: [
    {
      name: "Installation",
      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    },
    {
      name: "Manufacturing",
      data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    },
    {
      name: "Sales & Distribution",
      data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    },
    {
      name: "Project Development",
      data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
    },
    {
      name: "Other",
      data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    }
  ]
};

class Line extends Component {
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
    const { options } = this.props;

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

export default Line;
