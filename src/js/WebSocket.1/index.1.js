import React, { Component } from "react";
import ReactDOM from "react-dom";
import ChartWrapper from "../Chart/ChartWrapper";
// import { process_dataResponses } from "./process_InboundLiveStatus";
//import "./WebSocket";
// import "../WebSocket/index";  html5 sample

import {
  InboundLiveStatusTable,
  tblCols,
  TablesToDisplay
} from "./InboundLiveStatus";
import { getData } from "../../data/RealtimeFeed";

let userCount = 0;
var version = 1;
var realtimeFeedHost = null;
var webSocketRTF;
var host;
var wsprotocol = "wss";
var msgQueueOut = [];

var objServer;
var debugList = [];
var auth = {
  server: "dev043.qatestlab.lan",
  username: "Administrator@mydomain.com",
  // username: "noor@admin.com",
  pass: "administrator"
};
var auth2 = {
  server: "dev043.qatestlab.lan",
  username: "noor@admin.com",
  pass: "administrator"
};
var objDebug;
var objchkDebug;
var g_seqNo = 1;
var g_SessionID = "";
var btnReqAgentData = null;
var objLastResult = null;

var urlParams;

function getURLParams() {
  var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function(s) {
      return decodeURIComponent(s.replace(pl, " "));
    },
    query = window.location.search.substring(1);

  urlParams = {
    user: "",
    pass: ""
  };
  while ((match = search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
}

function onbodyload() {
  // get references to frequently used controls
  objServer = document.getElementById("txtServer");
  objDebug = document.getElementById("txtDebug");
  objchkDebug = document.getElementById("chkDebug");
  objLastResult = document.getElementById("LastResult");
  btnReqAgentData = document.getElementById("btnReqAgentData");
  document.getElementById("txtLocation").value = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

  document.getElementById("txtUser").value = auth.username;
  document.getElementById("txtPass").value = auth.pass;

  objServer.value = auth.server || window.location.hostname;
  document.getElementById("clearDebug").onclick = ClearDebug;

  //objDebug.ondblclick = ClearDebug;
  getURLParams();
  // btnReqAgentData_Click();
  init_toffee();
}

function CreateRequest(SessionID) {
  var realTimeRequest = {
    // Create request object
    Location: document.getElementById("txtLocation").value, // User location
    SeqNo: g_seqNo++, // sequence number for tracking
    Requests: [] // create empty request array
  };

  if (
    SessionID != null &&
    SessionID != "" &&
    SessionID != "00000000-0000-0000-0000-000000000000"
  ) {
    realTimeRequest.SessionID = SessionID; // Current Session ID
  } else {
    realTimeRequest.Username = document.getElementById("txtUser").value;
    realTimeRequest.Password = document.getElementById("txtPass").value;
  }

  if (!realTimeRequest.Username) {
    realTimeRequest.Username = document.getElementById("txtUser").value;
  }

  if (!realTimeRequest.Password) {
    realTimeRequest.Password = document.getElementById("txtPass").value;
  }

  return realTimeRequest;
}

function ProcessError(textStatus) {
  trace("error: " + text, true);
  SetStatusText(textStatus);

  ClearTable();
}
function SetStatusText(text) {
  var dateVar = new Date();
  var datestr =
    AddLeadingZero(dateVar.getHours()) +
    ":" +
    AddLeadingZero(dateVar.getMinutes()) +
    ":" +
    AddLeadingZero(dateVar.getSeconds()) +
    "." +
    dateVar.getMilliseconds() +
    ">";

  objLastResult.innerText = datestr + "> " + text;
}

function AddLeadingZero(number) {
  return (number < 10 ? "0" : "") + number;
}

function trace(text, bShow) {
  if (objchkDebug.checked || bShow) {
    var dateVar = new Date();
    var datestr =
      AddLeadingZero(dateVar.getHours()) +
      ":" +
      AddLeadingZero(dateVar.getMinutes()) +
      ":" +
      AddLeadingZero(dateVar.getSeconds()) +
      "." +
      dateVar.getMilliseconds() +
      ">  ";

    debugList.push(datestr + text + "<br>");
    if (debugList.length > 40) {
      debugList.shift();
    }
    var text = debugList.join();
    console.log(text);
    //objDebug.innerHTML = text;
    //objDebug.scrollIntoView({ behavior: "smooth" });

    //objDebug.scrollTop = objDebug.scrollHeight - objDebug.clientHeight;
  } else {
    console.log(text);
  }
}

function ClearDebug() {
  objDebug.innerHTML = "";
  debugList = [];
}

var bCanOpen = true;

// document.body.onload = onbodyload();

function init_toffee() {
  window.onscroll = function() {
    myFunction();
  };

  var navbar = document.getElementById("navbar");
  var sticky = navbar.offsetTop;

  function myFunction() {
    if (window.pageYOffset >= sticky) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  }
}

class WebSocketD extends React.Component {
  constructor(props) {
    super(props);
    let wSckt = null;
    this.state = {
      timeStamp: Date.now(),
      maxReconnect: 3,
      users: [],
      error: null,
      auth: auth2,
      open: false,
      inboundLiveStatus: [],
      inboundLiveStatusLatest: [],
      reactTable_columns: [],
      reactTable_columns2: [],
      reactTable_data: [],
      reactTable_data2: [],

      highchart_x: ["queueName"],
      highchart_y: ["currentCallsWaitingCount"],
      highchartSeries: []
    };
  }

  componentDidMount() {
    onbodyload();
    btnReqAgentData.onclick = this.btnReqAgentData_Click.bind(this);
    this.btnReqAgentData_Click();
  }

  set_table_Data() {
    this.state.inboundLiveStatusLatest.Rows[0].Data;

    const cols2 = this.state.reactTable_columns2;
    const cols = this.state.reactTable_columns;
    const rows = this.state.inboundLiveStatusLatest.Rows;
    const accessors = cols.map(item => item.accessor);

    //  map data to col
    // const sver_cols = this.state.sver_cols;
    // const mappedRow = {};
    // const new_JsonRows2 = rows.map(oneRow => {
    //   let jsonRow = {};
    //   const sver_row = oneRow.Data;

    //   const jsoned_row = cols2.map((tblCol, index, arr) => {
    //     //  start map row into Json
    //     const mappedRow = {};
    //     const jsonArr = sver_cols.map((sver_col, i) => {
    //       const value = sver_row[i];
    //       if (!mappedRow[sver_col]) {
    //         mappedRow[sver_col] = "";
    //       }
    //       mappedRow[sver_col] = value;
    //     });
    //     //  end map row into Json

    //     const dummy_mappedRow = {
    //       currentCallbacksLongestWaitingTime: 0,
    //       currentCallbacksWaitingCount: 0,
    //       currentCallsWaitingCount: 1,
    //       currentLongestWaitingTime: 5,
    //       currentTotalAgentNotReadyCount: 0,
    //       currentTotalAgentReadyCount: 0,
    //       currentTotalAgentTalkingCount: 0,
    //       queueId: 4,
    //       queueName: "Adam_Default",
    //       rowUpdateTime: "2018-10-04T16:11:57.4000802Z"
    //     };

    //     const required_output = [
    //       {
    //         queueId: 4,
    //         queueName: "Adam_Default",
    //         currentCallsWaitingCount: 1,
    //         currentLongestWaitingTime: 5,
    //         currentTotalAgentReadyCount: 0,
    //         currentTotalAgentNotReadyCount: 0,
    //         currentTotalAgentTalkingCount: 0,
    //         rowUpdateTime: "2018-10-04T16:18:42.3223862Z",
    //         currentCallbacksWaitingCount: 0,
    //         currentCallbacksLongestWaitingTime: 0
    //       }
    //     ];

    //     let dd = tblCols;

    //     mappedRow;

    //     const new_value = tblCols.map((item, i, arr) => {
    //       const accessor = item.accessor
    //         ? item.accessor
    //         : item.getValue(mappedRow, data);

    //       return { Header: header, accessor: accessor };
    //     });

    //     // const accessor = tblCol.accessor
    //     //   ? item.accessor
    //     //   : tblCol.getValue(mappedObj, data);

    //     // const header = tblCol.Header || tblCol.accessor|| tblCol.Name;

    //     // let colName = [accessors[index]];
    //     // if (!jsonRow[colName]) {
    //     //   jsonRow[colName] = "";
    //     // }
    //     // jsonRow[colName] = tblCol;

    //     var rObj = {};

    //     return rObj;
    //   });
    //   return jsonRow;
    // });

    //finish map data

    // make array of objects- set columns with value
    const new_JsonRows = rows.map(oneRow => {
      let jsonRow = {};
      const row = oneRow.Data;
      const jsoned_row = row.map((item, index) => {
        let colName = [accessors[index]];
        if (!jsonRow[colName]) {
          jsonRow[colName] = "";
        }
        jsonRow[colName] = item;
        var rObj = { [colName]: item };
        return rObj;
      });
      return jsonRow;
    });

    // getting data first time
    if (this.state.reactTable_data.length === 0) {
      this.setState(prevState => ({
        reactTable_data: new_JsonRows,
        ...prevState.reactTable_data
      }));
    } else {
      // need to find and update existing rows
      const new_queueIds = new_JsonRows.map(x => x.queueId);
      const existingRows = this.state.reactTable_data;

      //  console.log("to update : " + new_queueIds);
      const updatedRows = existingRows.map((row, i, array) => {
        if (Array.isArray(new_queueIds)) {
          const rowToReplace = new_queueIds.includes(row.queueId);
          if (rowToReplace) {
            row.queueId;
            i;
            var found = new_JsonRows.find(element => {
              return row.queueId == element.queueId;
            });
            if (found) {
              row = { ...row, ...found };
            }
          }
        }
        return row;
      });

      this.setState(prevState => ({
        reactTable_data: updatedRows
      }));

      // var languages = ["C", "C++", "Java", "JavaScript"];
      // // The following statement replaces the second element by a new one.
      // // arr.splice(start_index, number_of_elements_to_remove, newObj);
      // languages.splice(1, 1, "Python");
      // console.log(languages);
      // ["C", "Python", "Java", "JavaScript

      //  const index = dummy.findIndex(item => item.i === gridItem_i);
    }
  }

  set_table_Cols(responses) {
    if (
      responses &&
      responses[0] &&
      responses[0].Columns &&
      this.state.reactTable_columns.length === 0
    ) {
      const responseCols = responses[0].Columns;

      let cols2 = tblCols.map((item, i, arr) => {
        return {
          Header: item.Header || item.accessor,
          accessor: item.accessor || undefined,
          getValue: item.getValue
        };
      });

      let cols = responseCols.map(item => {
        return { Header: item.Name, accessor: item.Name };
      });

      const highchartSeries = responseCols.map(item => {
        return { name: item.Name, data: [] };
      });

      this.setState({
        sver_cols: responseCols.map(item => {
          return item.Name;
        }),
        reactTable_columns2: cols2,

        reactTable_columns: cols,
        highchartSeries: highchartSeries
      });
    }
  }

  process_dataResponses(responses) {
    //  console.log(responses[0].Rows[0].Data);
    let srch = responses.find(item => item.name === "InboundLiveStatus");
    if (srch !== undefined) {
      this.set_table_Cols(responses);

      const new_InboundState = [...this.state.inboundLiveStatus, srch];

      this.setState({ inboundLiveStatusLatest: srch });
      this.setState({
        inboundLiveStatus: new_InboundState
      });
      // Start timing now
      // console.time("set_table_Data");
      this.set_table_Data(srch);

      // ... and stop.
      // console.timeEnd("set_table_Data");
    }
  }

  clearSocketState() {
    if (this.wSckt) {
      webSocketRTF = null;
      userCount--;
    }

    g_SessionID = "";

    this.setState({
      timeStamp: Date.now(),
      maxReconnect: 3,
      users: [],
      error: null,
      auth: auth2,
      open: false,
      inboundLiveStatus: [],
      inboundLiveStatusLatest: [],
      reactTable_columns: [],
      reactTable_data: [],
      highchartSeries: []
    });
  }

  btnReqAgentData_Click() {
    // if (this.wSckt) {
    //   this.handleWebsocketClose(event);
    //   this.clearSocketState();
    //   this.openWebSocket();
    // }
    realtimeFeedHost = objServer.value;
    trace("btnReqAgentData_Click start seqNo: " + g_seqNo);
    var jsonStr = "";
    var realTimeRequest = CreateRequest(g_SessionID); // Create request header
    // testData.Location = realTimeRequest.Location;

    for (var reqs in TablesToDisplay) {
      if (TablesToDisplay.hasOwnProperty(reqs)) {
        var req = TablesToDisplay[reqs];
        var req1 = {
          // create request
          action: "Add",
          FeedName: req.FeedName, //"TestDataCache1",				// we want to get AgentStatus data
          SendColumns: req.SendColumns, // we want to see data headers in first response
          ChangeColumns: req.ChangeColumns, // Create empty array for columns changes,
          filters: req.filter,
          Columns: req.Columns
        };

        var Columns = document.getElementById("txtColumns").value;
        if (Columns.trim) {
          Columns = Columns.trim();
        }
        if (Columns.length > 0) {
          // do we want to only be notified when a column changes
          var columnSplit = Columns.split(","); // yes, so get which columns
          for (var i = 0; i < columnSplit.length; i++) {
            req1.ChangeColumns.push(columnSplit[i]); // add to ChangeColumns array
          }
        }

        realTimeRequest.Requests.push(req1);
      }
    }

    jsonStr = JSON.stringify(realTimeRequest, null, " ");
    trace(jsonStr);
    this.sendRequest(realTimeRequest); //jsonStr);
  }

  sendRequest(data) {
    if (data) {
      this.sendData(webSocketRTF, data);
    }
  }

  processResponse(data) {
    SetStatusText(data.result);

    switch (data.result) {
      case "OK": {
        trace(
          "success result:  " +
            data.result +
            " seqNo: " +
            data.SeqNo +
            " SessionID: " +
            data.SessionID
        );
        SetStatusText("OK. Processing...");
        this.process_dataResponses(data.responses);
        for (
          var iDataCache = 0;
          iDataCache < data.responses.length;
          iDataCache++
        ) {
          var headers = data.responses[iDataCache].Columns;
          var AgtStatus = data.responses[iDataCache].Rows;
        }
        SetStatusText("OK. Done...");
        break;
      }
      case "NoRequestsPending": {
        window.setTimeout("btnReqAgentData_Click();", 100);
        break;
      }
      case "Poll": {
        this.sendPoll();
        break;
      }
      case "Bumped": {
        trace(
          "result: " +
            data.result +
            " seqNo: " +
            data.SeqNo +
            " SessionID: " +
            data.SessionID,
          true
        );
        //SessionID = "";  why?
        break;
      }
      default: {
        trace(
          "result: " +
            data.result +
            " seqNo: " +
            data.SeqNo +
            " SessionID: " +
            data.SessionID,
          true
        );
        g_SessionID = "";

        break;
      }
    }
  }

  sendData(webSocketRTF, data) {
    if (webSocketRTF == null) {
      if (bCanOpen) {
        msgQueueOut.push(data);
        this.openWebSocket();
      }
    } else {
      var s = null;
      if (typeof data != "string") {
        s = JSON.stringify(data);
      } else {
        s = data;
      }
      webSocketRTF.send(s);
    }
  }

  componentWillUnmount() {
    this.wSckt.close();
  }

  openWebSocket() {
    host = objServer.value || window.location.hostname;
    wsprotocol = window.location.protocol === "https:" ? "wss" : "ws";

    if (webSocketRTF == null) {
      try {
        userCount++;

        webSocketRTF = this.wSckt = new WebSocket(
          wsprotocol + "://" + host + "/realtimefeeds/",
          "WestCloudRealTimeFeed"
        );
        webSocketRTF.onmessage = this.handleWebsocketData.bind(this);
        webSocketRTF.onopen = this.handleWebSocketOpen.bind(this);
        webSocketRTF.onerror = this.handleWebsocketError.bind(this);
        webSocketRTF.onclose = this.handleWebsocketClose.bind(this);
      } catch (e) {
        trace(" error " + e);
      }
    }
  }

  handleWebsocketError(event) {
    trace("handleWebsocketError: " + event);
    bCanOpen = false;
    if (event.target == webSocketRTF) {
      webSocketRTF = null;
    }

    if (this.state.maxReconnect > 0) {
      trace("Reconnect attempt left: " + this.state.maxReconnect);
      this.setState({ maxReconnect: this.state.maxReconnect - 1 });
      this.openWebSocket();
    }
  }

  handleWebsocketClose(event) {
    event.reason ? trace("handleWebsocketClose: " + event.reason) : null;
    bCanOpen = false;
    if (event.target && event.target == webSocketRTF) {
      webSocketRTF = null;
      userCount--;
    }
  }

  sendPoll() {
    var pollRequest = CreateRequest(g_SessionID); // Create request header
    var req1 = {
      // create request
      //FeedName: "TestDataCache1",					// we want to get AgentStatus data
      action: "Poll"
    };
    pollRequest.Requests.push(req1);
    this.sendData(webSocketRTF, pollRequest);
  }

  handleWebsocketData(event) {
    try {
      var data = event.data;
      if (typeof data == "string") {
        data = JSON.parse(data);
      }

      trace("handleWebsocketData: " + JSON.stringify(data, null, "\t"));

      if (data) {
        if (
          typeof g_SessionID != "undefined" &&
          g_SessionID == "" &&
          data.result == "OK"
        ) {
          g_SessionID = data.SessionID;
        }

        switch (data.result) {
          case "Poll": {
            this.sendPoll();
            break;
          }
          case "OK": {
            this.processResponse(data);
            break;
          }
          default: {
            trace(
              "handleWebsocketData: result: " +
                data.result +
                " " +
                data.SeqNo +
                " " +
                data.CurrentDateTime
            );
            break;
          }
        }
      }
    } catch (e) {
      trace(
        "<p style='color: red;'>> handleWebsocketData: exception:: " +
          e +
          "</p>"
      );
    }
  }

  handleWebSocketOpen(event) {
    trace("<p style='color: green;'>> handleWebSocketOpen: CONNECTED</p>");
    if (event.target == webSocketRTF) {
      while (msgQueueOut.length > 0) {
        var msg = msgQueueOut.shift();
        this.sendData(webSocketRTF, msg);
      }
    }
  }

  render() {
    //       <h1>userCount: {userCount}</h1>
    return (
      <div>
        <ChartWrapper
          data={this.state.reactTable_data}
          data2={this.state.reactTable_data2}
          columns={this.state.reactTable_columns}
          columns2={this.state.reactTable_columns2}
        />
      </div>
    );
  }
}

const inboundLiveStatusDiv = document.getElementById("inboundLiveStatusDiv");
ReactDOM.render(<WebSocketD />, inboundLiveStatusDiv);
