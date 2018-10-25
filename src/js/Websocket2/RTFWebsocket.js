var version = 1;
var realtimeFeedHost = null;
var webSocketRTF;
var host;
var wsprotocol = "wss";
var msgQueueOut = [];
var bCanOpen = true;

function openWebSocket() {
  host = realtimeFeedHost || window.location.hostname;
  if (window.location.protocol === "http:") {
    wsprotocol = "ws";
  }
  trace("openWebSocket");
  if (webSocketRTF == null) {
    try {
      webSocketRTF = new WebSocket(
        wsprotocol + "://" + host + "/realtimefeeds/",
        "WestCloudRealTimeFeed"
      );
      webSocketRTF.onmessage = handleWebsocketData;
      webSocketRTF.onopen = handleWebSocketOpen;
      webSocketRTF.onerror = handleWebsocketError;
      webSocketRTF.onclose = handleWebsocketClose;
    } catch (e) {
      trace("openWebSocket error " + e);
    }
  }
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
  if (event.target == webSocketRTF) {
    while (msgQueueOut.length > 0) {
      var msg = msgQueueOut.shift();
      sendData(webSocketRTF, msg);
    }
  }
}

function handleWebsocketError(event) {
  bCanOpen = false;

  trace("handleWebsocketError: " + event.data);
  if (event.target == webSocketRTF) {
    webSocketRTF = null;
    //window.setTimeout(openWebSocket, 5000);
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
  if (event.target == webSocketRTF) {
    webSocketRTF = null;
  }
}

function sendData(socket, data) {
  if (socket == null) {
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
    socket.send(s);
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
  sendData(webSocketRTF, pollRequest);
}
