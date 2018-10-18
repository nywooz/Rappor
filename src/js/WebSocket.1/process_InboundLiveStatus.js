import React, { Component } from "react";
import ReactDOM from "react-dom";

let responses = ["testoutside"];


let reponseCollection = [];

function process_dataResponses(respnses) {
  //  console.log(respnses);

  let srch = respnses.find(item => item.name === "InboundLiveStatus");
  if (srch !== undefined) {
    responses = respnses;
    //debugger;


    reponseCollection.push(responses);
  }
}

export { process_dataResponses };

// class InboundLiveStatus extends React.Component {

//   render() {
//     return <h1>Hello, {responses}</h1>;
//   }
// }

// ReactDOM.render(
//   <InboundLiveStatus />,
//   document.getElementById("InboundLiveStatus")
// );


reponseCollection = [
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [1, "Hello", 0, 0, 0],
          PrimaryKey: "PK_7_1"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [4, "Adam_Default", 0, 0, 0],
          PrimaryKey: "PK_7_4"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [137, "Noor campaign_Default", 0, 0, 0],
          PrimaryKey: "PK_7_137"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [1, "Hello", 0, 0, 0],
          PrimaryKey: "PK_7_1"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [1, "Hello", 0, 0, 0],
          PrimaryKey: "PK_7_1"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [137, "Noor campaign_Default", 0, 0, 0],
          PrimaryKey: "PK_7_137"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [4, "Adam_Default", 0, 0, 0],
          PrimaryKey: "PK_7_4"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [137, "Noor campaign_Default", 0, 0, 0],
          PrimaryKey: "PK_7_137"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [137, "Noor campaign_Default", 0, 0, 0],
          PrimaryKey: "PK_7_137"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [4, "Adam_Default", 0, 0, 0],
          PrimaryKey: "PK_7_4"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [1, "Hello", 0, 0, 0],
          PrimaryKey: "PK_7_1"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [1, "Hello", 0, 0, 0],
          PrimaryKey: "PK_7_1"
        }
      ]
    }
  ],
  [
    {
      name: "InboundLiveStatus",
      Columns: null,
      Rows: [
        {
          action: 0,
          Data: [4, "Adam_Default", 0, 0, 0],
          PrimaryKey: "PK_7_4"
        }
      ]
    }
  ]
];