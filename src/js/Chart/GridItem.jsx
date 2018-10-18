import React from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
let myVar = 0;

import { gridTypes } from "../../data/Country";
import { resizeHChart, findAncestor, debounce } from "../commonFns";
import { iconsTypeMap } from "../RGL/Skeleton";
import { TemplateChart } from "./TemplateChart";

export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    const cb = function() {};

    const { templateType } = this.props;
    const gridType = get_gridType(templateType);

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
              return (
                <p props={this.props}>
                  "New chart, not yet worked on it " + {templateType}{" "}
                </p>
              );
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
