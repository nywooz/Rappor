import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  title: {
    text: "My chart"
  },
  chart: {
    type: "line",
    animation: true
  },
  series: [
    {
      data: [1, 4, 3]
    }
  ],
  credits: {
    enabled: false
  }
};

function SimpleLineChart() {
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default SimpleLineChart;
