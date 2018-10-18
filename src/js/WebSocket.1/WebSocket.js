import React, { Component } from "react";
import ReactDOM from "react-dom";

var bCanOpen = true;

let auth = {
  server: "dev043.qatestlab.lan",
  username: "noor@admin.com",
  pass: "administrator"
};

let webSckt = null;
let realtimeFeedHost = null;
let host = null;
let wsprotocol = "wss";
let msgQueueOut = [];
let objServer = null;
let debugList = [];
let objDebug;
let objchkDebug;
let g_seqNo = 1;
let g_SessionID = "";
let btnReqAgentData = null;
let objLastResult = null;
let urlParams = null;

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
      ]
    ],
    Columns: [
      "queueId",
      "queueName",
      "currentTotalAgentReadyCount",
      "currentTotalAgentNotReadyCount",
      "currentTotalAgentTalkingCount"
    ]
  }
};

class WebSocket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      error: null,
      auth: auth,
      open: false
    };
  }

  trace(htm) {
    console.log(htm);
  }

  openWebSocket() {
    const auth = this.state.auth;
    const winLoc = window.location;

    const host = auth.server || winLoc.hostname;
    const wsprotocol = winLoc.protocol === "http:" ? "ws" : "wss";

    if (this.webSckt == null) {
      this.webSckt = new WebSocket(
        wsprotocol + "://" + host + "/realtimefeeds/",
        "WestCloudRealTimeFeed"
      );

      this.webSckt.onopen = handleWebSocketOpen;
      this.webSckt.onmessage = handleWebsocketData;
      this.webSckt.onerror = handleWebsocketError;
      this.webSckt.onclose = handleWebsocketClose;
    }
  }

  handleWebSocketOpen(e) {
    this.setState({
      open: true
    });
  }

  handleWebsocketData(e) {
    debugger;
    let data = event.data;

    this.setState({
      users: Object.values(JSON.parse(data))
    });
    if (data) {
      if (this.g_SessionID == "" && data.result == "OK") {
        this.g_SessionID = data.SessionID;
      }

      switch (data.result) {
        case "Poll": {
          this.sendPoll();
          break;
        }
        case "OK": {
          this.ProcessResponse(data);
          break;
        }
      }
    }
  }

  handleWebsocketError(e) {
    this.setState({
      error: "WebSocket error"
    });
  }

  handleWebsocketClose(e) {
    !e.wasClean &&
      this.setState({
        error: `WebSocket error: ${e.code} ${e.reason}`
      });
  }

  componentDidMount() {
    onbodyload2();
    this.openWebSocket();
  }

  componentWillUnmount() {
    this.webSckt.close();
  }

  render() {
    return <h1>Hello, {"Websocket2"}</h1>;
  }
}

ReactDOM.render(<WebSocket />, document.getElementById("websocketApp"));

export { WebSocket };

function btnReqAgentData_Click() {
  realtimeFeedHost = objServer.value;
  trace("btnReqAgentData_Click start seqNo: " + g_seqNo);
  var jsonStr = "";
  var realTimeRequest = CreateRequest(g_SessionID); // Create request header

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
  sendRequest(realTimeRequest); //jsonStr);
}

function ClearDebug() {
  objDebug.innerHTML = "";
  debugList = [];
}

function openWebSocket() {
  host = realtimeFeedHost || window.location.hostname;
  if (window.location.protocol === "http:") {
    wsprotocol = "ws";
  }
  if (webSckt == null) {
    try {
      webSckt = new WebSocket(
        wsprotocol + "://" + host + "/realtimefeeds/",
        "WestCloudRealTimeFeed"
      );
      webSckt.onopen = handleWebSocketOpen;
      webSckt.onmessage = handleWebsocketData;
      webSckt.onerror = handleWebsocketError;
      webSckt.onclose = handleWebsocketClose;
    } catch (e) {
      trace("error " + e);
    }
  }
}

function getURLParams() {
  var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function(s) {
      return decodeURIComponent(s.replace(pl, " "));
    },
    query = window.location.search.substring(1);

  urlParams = { user: auth.username, pass: auth.pass };

  while ((match = search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
}

function onbodyload2() {
  // get references to frequently used controls
  objServer = document.getElementById("txtServer");
  objDebug = document.getElementById("txtDebug");
  objchkDebug = document.getElementById("chkDebug");
  objLastResult = document.getElementById("LastResult");
  btnReqAgentData = document.getElementById("btnReqAgentData");
  btnReqAgentData.onclick = btnReqAgentData_Click;
  objDebug.ondblclick = ClearDebug;
  getURLParams();

  document.getElementById("txtLocation").value =
    urlParams["Location"] || "myLoaction";

  objServer.value = auth.server || window.location.hostname;

  btnReqAgentData_Click();
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
    realTimeRequest.Username = auth.username;
    realTimeRequest.Password = auth.pass;
  }
  return realTimeRequest;
}

function sendRequest(data) {
  if (data) {
    sendData(webSckt, data);
  }
}

function ProcessResponse(data) {
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
      process_dataResponses(data.responses);
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
      sendPoll();
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
      ">";

    debugList.push(datestr + text + "<br>");
    if (debugList.length > 40) {
      debugList.shift();
    }
    var text = debugList.join();
    //console.log(text);
    //objDebug.innerHTML = text;
    objDebug.scrollTop = objDebug.scrollHeight - objDebug.clientHeight;
  } else {
    console.log(text);
  }
}

function ClearDebug() {
  objDebug.innerHTML = "";
  debugList = [];
}

if (typeof trace == "undefined") {
  trace = function(text) {
    if (typeof console != "unknown" && console != null) {
      console.log(text);
    }
  };
}

function handleWebSocketOpen(event) {
  trace("handleWebSocketOpen: " + event.data);
  if (event.target == webSckt) {
    while (msgQueueOut.length > 0) {
      var msg = msgQueueOut.shift();
      sendData(webSckt, msg);
    }
  }
}

function handleWebsocketError(event) {
  bCanOpen = false;

  trace("handleWebsocketError: " + event.data);
  if (event.target == webSckt) {
    webSckt = null;
  }
}

function handleWebsocketData(event) {
  try {
    var data = event.data;
    if (typeof data == "string") {
      data = JSON.parse(data);
    }

    trace("handleWebsocketData: " + JSON.stringify(data, null, "\t"));

    if (data) {
      if (g_SessionID == "" && data.result == "OK") {
        g_SessionID = data.SessionID;
      }

      switch (data.result) {
        case "Poll": {
          sendPoll();
          break;
        }
        case "OK": {
          ProcessResponse(data);
          break;
        }
      }
    }
  } catch (e) {
    trace("handleWebsocketData: exception: " + e);
  }
}

function handleWebsocketClose(event) {
  trace("handleWebsocketClose: " + event.reason);
  bCanOpen = false;
  if (event.target == webSckt) {
    webSckt = null;
  }
}

function sendData(webSckt, data) {
  if (webSckt == null) {
    if (bCanOpen) {
      msgQueueOut.push(data);
      openWebSocket();
    }
  } else {
    var s = null;
    if (typeof data != "string") {
      s = JSON.stringify(data);
    } else {
      s = data;
    }
    webSckt.send(s);
  }
}

function sendPoll() {
  var pollRequest = CreateRequest(g_SessionID); // Create request header
  var req1 = {
    // create request
    //FeedName: "TestDataCache1",					// we want to get AgentStatus data
    action: "Poll"
  };
  pollRequest.Requests.push(req1);
  sendData(webSckt, pollRequest);
}

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
