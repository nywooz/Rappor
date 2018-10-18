import React from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HC_map from "highcharts/modules/map";
import HighchartsReact from "highcharts-react-official";

// init the module
HC_map(Highcharts);

// instead of import + init you could use require as:
// require('highcharts/modules/map')(Highcharts)
// the same applies to any other Highcharts module

const options = {
  title: {
    text: "My map chart"
  },
  series: [
    {
      // any meaningful map data is much larger,
      // but it should go in here
      data: [1, 2, 3]
    }
  ]
};

const App = () => (
  <div>
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"mapChart"}
      options={options}
    />
  </div>
);

export default App;

// render(<App />, document.getElementById('root'))
