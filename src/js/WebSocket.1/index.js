import React, { Component } from "react";
import ReactDOM from "react-dom";
// import { process_dataResponses } from "./process_InboundLiveStatus";
//import "./WebSocket";
// import "../WebSocket/index";  html5 sample

import InboundLiveStatusTable from "./InboundLiveStatus";

import { getData } from "../../data/RealtimeFeed";

let userCount = 0;

let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);

var socketTestTimer = null;
var version = 1.2;
var realtimeFeedHost = null;
var webSocketRTF;
var host;
var wsprotocol = "wss";
var msgQueueOut = [];
var objServer, objUser, objPass, objLocation;
var debugList = [];

var testData = { sessionid: "", FeedName: "", Location: "" };
if (this && this.location) {
  var pageName = this.location.pathname
    .replace("/maximise/AJAX/", "")
    .replace(".aspx", "");
}
var RTFLastDateExd = new Date();

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

var TablesToDisplay = {
  // ContactSessionState: {
  //   FeedName: "ContactSessionState", //"TestDataCache1" ,
  //   SendColumns: true,
  //   ChangeColumns: [],

  //   Columns: []
  // },
  // LiveAgentStatus: {
  //   FeedName: "LiveAgentStatus", //"TestDataCache1" ,
  //   SendColumns: true,
  //   ChangeColumns: [],
  //   filter: [
  //     [
  //       {
  //         ColumnName: "timeBucketId",
  //         operation: "Equals",
  //         Value: 1
  //       }
  //     ]
  //   ],
  //   Columns: ["recordId", "agentId", "agentName", "agentState"]
  // },

  InboundLiveStatus: {
    FeedName: "InboundLiveStatus", //"TestDataCache2" ,
    SendColumns: true,
    ChangeColumns: [],
    filter: [
      [
        {
          ColumnName: "timeBucketId",
          operation: "Equals",
          Value: 7
        }
        //,

        //                {
        //                    "ColumnName": "queueName",
        //                    "operation": "Equals",
        //                    "Value": "3333"
        //                }
      ]
      //,
      //[

      //                    {
      //                        "ColumnName": "timeBucketId",
      //                        "operation": "Equals",
      //                        "Value": 7
      //                    }
      //    ,

      //                    {
      //                        "ColumnName": "queueName",
      //                        "operation": "Equals",
      //                        "Value": "Q5555ss"
      //                    }

      //]
    ],
    Columns: [
      "queueId",
      "queueName",
      "currentCallsWaitingCount",
      "currentTotalAgentReadyCount",
      "currentTotalAgentNotReadyCount",
      "currentTotalAgentTalkingCount"
    ]
  }
};

var Columns = [
  {
    Name: "recordId",
    ColumnIndex: 0,
    DataType: "String"
  },
  {
    Name: "timeBucketId",
    ColumnIndex: 1,
    DataType: "Int32"
  },
  {
    Name: "queueId",
    ColumnIndex: 2,
    DataType: "Int32"
  },
  {
    Name: "queueName",
    ColumnIndex: 3,
    DataType: "String"
  },
  {
    Name: "rowUpdateTime",
    ColumnIndex: 4,
    DataType: "DateTime"
  },
  {
    Name: "currentLongestWaitingTime",
    ColumnIndex: 5,
    DataType: "Int32"
  },
  {
    Name: "currentTotalCallsWaitingTime",
    ColumnIndex: 6,
    DataType: "Int32"
  },
  {
    Name: "currentCallsWaitingCount",
    ColumnIndex: 7,
    DataType: "Int32"
  },
  {
    Name: "currentCallsServiceThreasholdMetCount",
    ColumnIndex: 8,
    DataType: "Int32"
  },
  {
    Name: "currentCallbacksLongestWaitingTime",
    ColumnIndex: 9,
    DataType: "Int32"
  },
  {
    Name: "currentCallbacksTotalWaitingTime",
    ColumnIndex: 10,
    DataType: "Int32"
  },
  {
    Name: "currentCallbacksWaitingCount",
    ColumnIndex: 11,
    DataType: "Int32"
  },
  {
    Name: "currentCallbacksServiceThreasholdMetCount",
    ColumnIndex: 12,
    DataType: "Int32"
  },
  {
    Name: "currentTotalAgentReadyCount",
    ColumnIndex: 13,
    DataType: "Int32"
  },
  {
    Name: "currentTotalAgentNotReadyCount",
    ColumnIndex: 14,
    DataType: "Int32"
  },
  {
    Name: "currentTotalAgentTalkingCount",
    ColumnIndex: 15,
    DataType: "Int32"
  },
  {
    Name: "currentTotalAgentWrappingCount",
    ColumnIndex: 16,
    DataType: "Int32"
  },
  {
    Name: "currentTotalAgentPreviewingCount",
    ColumnIndex: 17,
    DataType: "Int32"
  },
  {
    Name: "answeredLongestWaitingTime",
    ColumnIndex: 18,
    DataType: "Int32"
  },
  {
    Name: "answeredTotalCallsWaitingTime",
    ColumnIndex: 19,
    DataType: "Int32"
  },
  {
    Name: "answeredCallsCount",
    ColumnIndex: 20,
    DataType: "Int32"
  },
  {
    Name: "answeredCallsServiceThreasholdMetCount",
    ColumnIndex: 21,
    DataType: "Int32"
  },
  {
    Name: "abandonedLongestWaitingTime",
    ColumnIndex: 22,
    DataType: "Int32"
  },
  {
    Name: "abandonedTotalCallsWaitingTime",
    ColumnIndex: 23,
    DataType: "Int32"
  },
  {
    Name: "abandonedCallsCount",
    ColumnIndex: 24,
    DataType: "Int32"
  },
  {
    Name: "abandonedCallsServiceThreasholdMetCount",
    ColumnIndex: 25,
    DataType: "Int32"
  },
  {
    Name: "dequeuedLongestWaitingTime",
    ColumnIndex: 26,
    DataType: "Int32"
  },
  {
    Name: "dequeuedTotalCallsWaitingTime",
    ColumnIndex: 27,
    DataType: "Int32"
  },
  {
    Name: "dequeuedCallsCount",
    ColumnIndex: 28,
    DataType: "Int32"
  },
  {
    Name: "dequeuedCallsServiceThreasholdMetCount",
    ColumnIndex: 29,
    DataType: "Int32"
  },
  {
    Name: "callbacksLongestWaitingTime",
    ColumnIndex: 30,
    DataType: "Int32"
  },
  {
    Name: "callbacksTotalWaitingTime",
    ColumnIndex: 31,
    DataType: "Int32"
  },
  {
    Name: "callbacksCount",
    ColumnIndex: 32,
    DataType: "Int32"
  },
  {
    Name: "callbacksServiceThreasholdMetCount",
    ColumnIndex: 33,
    DataType: "Int32"
  },
  {
    Name: "agentDidNotAnswerCount",
    ColumnIndex: 34,
    DataType: "Int32"
  },
  {
    Name: "assignedCampaignIds",
    ColumnIndex: 35,
    DataType: "String"
  }
];

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
  objUser = document.getElementById("txtUser");
  objPass = document.getElementById("txtPass");
  objLocation = document.getElementById("txtLocation");

  objLocation.value = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

  objUser.value =
    auth.username || urlParams["user"] || "administrator@tenant1.com";
  objPass.value = auth.pass || urlParams["pass"] || "Indigo12";
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
    Location: objLocation.value,
    SeqNo: g_seqNo++,
    Requests: []
  }; // User location // sequence number for tracking // create empty request array

  if (
    SessionID != null &&
    SessionID != "" &&
    SessionID != "00000000-0000-0000-0000-000000000000"
  ) {
    realTimeRequest.SessionID = SessionID; // Current Session ID
  } else {
    realTimeRequest.Username = objUser.value;
    realTimeRequest.Password = objPass.value;
  }

  if (!realTimeRequest.Username) {
    realTimeRequest.Username = objUser.value;
  }

  if (!realTimeRequest.Password) {
    realTimeRequest.Password = objPass.value;
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
    objDebug.innerHTML = text;
    objDebug.scrollIntoView({ behavior: "smooth" });

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
      reactTable_data: [],
      chart_Series: []
    };
  }

  componentDidMount() {
    onbodyload();
    btnReqAgentData.onclick = this.btnReqAgentData_Click.bind(this);
    this.btnReqAgentData_Click();
  }

  socketTester(that) {
    var tsDiff = (new Date() - RTFLastDateExd) / 1000;
    if (webSocketRTF != null) {
      if (tsDiff > 10) {
        console.log(
          pageName +
            "socketTester webSocketRTF state: " +
            webSocketRTF.readyState +
            " RTFLastDateExd: " +
            RTFLastDateExd +
            " tsDiff : " +
            tsDiff
        );
      }

      if (tsDiff > 60) {
        that.RTFWSclose(true);
      }
    } else {
      console.log(
        pageName +
          "socketTester webSocketRTF is null  RTFLastDateExd: " +
          RTFLastDateExd
      );
    }
  }

  RTFWSclose(bAllowRestart) {
    if (webSocketRTF != null) {
      webSocketRTF.close();
    }

    if (bAllowRestart) {
      bCanOpen = true;
      window.setTimeout(this.handleWebsocketClose, 1000, {
        reason: "RTFWSclose"
      });
    }

    webSocketRTF = null;
  }

  set_table_Data() {
    this.state.inboundLiveStatusLatest.Rows[0].Data;

    const cols = this.state.reactTable_columns;
    const rows = this.state.inboundLiveStatusLatest.Rows;
    const accessors = cols.map(item => item.accessor);

    const new_JsonRows = rows.map((oneRow, i) => {
      let jsonRow = {};
      const row = oneRow.Data;
      const jsoned_row = row.map((item, index, arr) => {
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

    if (this.state.reactTable_data.length === 0) {
      this.setState(prevState => ({
        reactTable_data: new_JsonRows,
        ...prevState.reactTable_data
      }));
    } else {
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

      this.setState(prevState => ({ reactTable_data: updatedRows }));

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
      let cols = responses[0].Columns.map(item => {
        // if (item.Name === "currentCallsWaitingCount") {

        //   return {
        //     Header: item.Name,
        //     accessor: item.Name,
        //     Cell: row => (
        //       <div
        //         style={{
        //           width: "100%",
        //           height: "100%",
        //           backgroundColor: "#dadada",
        //           borderRadius: "2px"
        //         }}
        //       >
        //         <div
        //           style={{
        //             width: `${row.value}%`,
        //             height: "100%",
        //             backgroundColor:
        //               row.value > 1
        //                 ? "#85cc00"
        //                 : row.value > 3
        //                   ? "#ffbf00"
        //                   : "#ff2e00",
        //             borderRadius: "2px",
        //             transition: "all .2s ease-out"
        //           }}
        //         >
        //           {row.value}
        //         </div>
        //       </div>
        //     )
        //   };
        // }

        return {
          Header: item.Name,
          accessor: item.Name
        };
      });

      this.setState({ reactTable_columns: cols });
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

      this.set_table_Data(srch);
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
      chart_Series: []
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

  openWebSocket(altLoc = "") {
    host = objServer.value || window.location.hostname;
    wsprotocol = window.location.protocol === "https:" ? "wss" : "ws";

    if (webSocketRTF == null) {
      try {
        userCount++;

        webSocketRTF = this.wSckt = new WebSocket(
          wsprotocol + "://" + host + "/realtimefeeds/" + altLoc,
          "WestCloudRealTimeFeed"
        );
        webSocketRTF.onopen = this.handleWebSocketOpen.bind(this);
        webSocketRTF.onmessage = this.handleWebsocketData.bind(this);
        webSocketRTF.onerror = this.handleWebsocketError.bind(this);
        webSocketRTF.onclose = this.handleWebsocketClose.bind(this);
      } catch (e) {
        trace("Create Websocket error " + e);
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

  sendRTFPollGeneric(seqNo) {
    var pollRequest = {
      // Create request object
      Location: testData.Location, // User location
      SessionID: testData.sessionid, // Current Session ID
      SeqNo: g_seqNo++, // sequence number for tracking
      responseToSeq: seqNo,
      timestamp: new Date(),
      Requests: [] // create empty request array
    };

    pollRequest.Requests.push({
      // create request
      action: "Poll"
    });
    console.log("sendRTFPollGeneric [" + JSON.stringify(pollRequest));
    sendData(webSocketRTF, pollRequest);
  }

  sendPoll() {
    debugger;
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

        testData.sessionid = data.SessionID;
        //			wsTrace("handleWebsocketData: result: " + data.result + " " + data.SeqNo + " " +   data.CurrentDateTime);
        RTFLastDateExd = new Date();

        switch (data.result) {
          case "Poll": {
            this.sendRTFPollGeneric(data.seqNo);
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

  sendRTFPollGeneric(seqNo) {
    var pollRequest = {
      // Create request object
      Location: testData.Location, // User location
      SessionID: testData.sessionid, // Current Session ID
      SeqNo: g_seqNo++, // sequence number for tracking
      responseToSeq: seqNo,
      timestamp: new Date(),
      Requests: [] // create empty request array
    };

    pollRequest.Requests.push({
      // create request
      action: "Poll"
    });
    console.log("sendRTFPollGeneric [" + JSON.stringify(pollRequest));
    sendData(webSocketRTF, pollRequest);
  }

  handleWebSocketOpen(event) {
    let that = this;
    trace("<p style='color: green;'>> handleWebSocketOpen: CONNECTED</p>");
    if (event.target == webSocketRTF) {
      socketTestTimer = window.setInterval(this.socketTester(that), 10000);

      while (msgQueueOut.length > 0) {
        var msg = msgQueueOut.shift();
        typeof msg == "string"
          ? trace("handleWebSocketOpen: sending s msg " + msg)
          : trace("handleWebSocketOpen: sending msg " + JSON.stringify(msg));

        this.sendData(webSocketRTF, msg);
      }
    }
  }

  render() {
    //       <h1>userCount: {userCount}</h1>

    return (
      <div>
        <InboundLiveStatusTable
          data={this.state.reactTable_data}
          columns={this.state.reactTable_columns}
        />
      </div>
    );
  }
}

const inboundLiveStatusDiv = document.getElementById("inboundLiveStatusDiv");

ReactDOM.render(<WebSocketD />, inboundLiveStatusDiv);
