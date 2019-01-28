import React from "react";
import { gridTypes } from "../../data/gridTypes";
import { resizeHChart } from "../commonFns";
import { TemplateChart } from "./TemplateChart";

export default class App extends React.Component {
  componentDidMount() {
    const ref_HighChart = this.ref_HighChart;
    resizeHChart(ref_HighChart);
  }

  render() {
    const cb = function() {};

    const gridType = get_gridType(templateType) || "highcharts";
    const { templateType } = this.props;

    return (
      <div>
        {(() => {
          switch (gridType) {
            case "highcharts":
              return (
                <TemplateChart
                  type={templateType}
                  ref={chart => {
                    this.ref_HighChart = chart;
                  }}
                />
              );
            case "others":
              return <p props={this.props}>{templateType} </p>;
            case "text":
              return <p props={this.props}>{templateType} </p>;
            case "image":
              return <p props={this.props}>{templateType} </p>;
            case "list":
              return <p props={this.props}>{templateType} </p>;
            case "table":
              return <p props={this.props}>{templateType} </p>;
            case "tachometer":
              return <p props={this.props}>{templateType} </p>;
            case "carousel":
              return <p props={this.props}>{templateType} </p>;
            default:
              return <p props={this.props}>{templateType} </p>;
          }
        })()}
      </div>
    );
  }
}

function get_gridType(type) {
  for (let key in gridTypes) {
    if (gridTypes.hasOwnProperty(key)) {
      if (gridTypes[key].includes(type)) {
        return key;
      }
    }
  }
}
