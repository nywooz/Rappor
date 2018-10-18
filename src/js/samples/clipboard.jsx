const CCPRO_columns = [
  {
    Header: "Longest Wait Time",
    mData: function(source) {
      if (
        source[
          InboundLiveStatusObj.TableStructure["currentCallsWaitingCount"]
        ] > 0
      ) {
        return formatedTime(
          gettimeinstate(
            source[InboundLiveStatusObj.TableStructure["rowUpdateTime"]],
            source[
              InboundLiveStatusObj.TableStructure["currentLongestWaitingTime"]
            ]
          )
        );
      } else {
        return formatedTime(0);
      }
    }
  },
  {
    Header: "Callback Longest Wait Time",
    mData: function(source) {
      if (
        source[
          InboundLiveStatusObj.TableStructure["currentCallbacksWaitingCount"]
        ] > 0
      ) {
        return formatedTime(
          gettimeinstate(
            source[InboundLiveStatusObj.TableStructure["rowUpdateTime"]],
            source[
              InboundLiveStatusObj.TableStructure[
                "currentCallbacksLongestWaitingTime"
              ]
            ]
          )
        );
      } else {
        return formatedTime(0);
      }
    }
  },
  {
    Header: "Avg Answer Time",
    mData: function(source) {
      return formatedTime(GetAvgTime(true, source));
    }
  },
  {
    Header: "Avg Abandoned Time",
    mData: function(source) {
      return formatedTime(GetAvgTime(false, source));
    }
  },
  {
    Header: "Service Factor %",
    mData: function(source) {
      return GetServiceFactor(source);
    }
  },
  {
    Header: "Offered",
    mData: function(source) {
      return GetOffered(source);
    }
  }
];

const optionTxt = [
  "Abandon Rate",
  "Abandon Rate Trend*",
  "Agent States*",
  "Agent Status*",
  "Avg Time in State Per Call*",
  "Avg Time in State Per Call-Trend*",
  "Call Outcomes*",
  "Call Outcomes By Dial Count*",
  "Call Types",
  "Call Types - Trend*",
  "Calling List Details*",
  "Campaign Goal*",
  "Campaign Status",
  "Cloud Routing Live Status*",
  "Connection Rate",
  "Connection Rate Trend*",
  "Global Campaign*",
  "Inbound Live Status*",
  "List Penetration",
  "Live Campaign Stats*",
  "Outcome Values*",
  "Outcomes - Trend*",
  "Ports in Use*",
  "Success Rate",
  "Success Rate - Trend*",
  "System Outcomes*",
  "Total Time in State*"
];

let cols = [
  {
    Header: "queueId",
    accessor: "queueId"
  },
  {
    Header: "queueName",
    accessor: "queueName"
  },
  {
    Header: "currentCallsWaitingCount",
    accessor: "currentCallsWaitingCount"
  },
  {
    Header: "currentLongestWaitingTime",
    accessor: "currentLongestWaitingTime"
  },
  {
    Header: "currentTotalAgentReadyCount",
    accessor: "currentTotalAgentReadyCount"
  },
  {
    Header: "currentTotalAgentNotReadyCount",
    accessor: "currentTotalAgentNotReadyCount"
  },
  {
    Header: "currentTotalAgentTalkingCount",
    accessor: "currentTotalAgentTalkingCount"
  },
  {
    Header: "rowUpdateTime",
    accessor: "rowUpdateTime"
  },
  {
    Header: "currentCallbacksWaitingCount",
    accessor: "currentCallbacksWaitingCount"
  },
  {
    Header: "currentCallbacksLongestWaitingTime",
    accessor: "currentCallbacksLongestWaitingTime"
  }
];

let datetimedelta = 0;

const mapper_Fns = {
  getMainCategoryColumn: function(responseName) {
    const map = {
      InboundLiveStatus: "queueName"
    };
    return map[responseName];
  },
  GetDivisionValue: function(Dividend, Divisor) {
    if (Divisor != 0) {
      return Dividend / Divisor;
    }
    return 0;
  },
  offered: function(map, responseData) {
    return (
      map["currentCallsWaitingCount"] +
      map["answeredCallsCount"] +
      map["abandonedCallsCount"] +
      map["dequeuedCallsCount"]
    );
  },

  formatedTime: function(seconds) {
    return seconds;

    // let formattedString = "";

    // if (seconds >= 3600) {
    //   var hours = Math.floor(seconds / 3600.0);
    //   formattedString += hours.toFixed() + "h";

    //   seconds -= hours * 3600;
    // }

    // if (seconds >= 60) {
    //   var mins = Math.floor(seconds / 60.0);
    //   formattedString += mins.toFixed() + "m";

    //   seconds -= mins * 60;
    // }

    // formattedString += seconds.toFixed() + "s";

    //return formattedString;
  },

  GetDateFromString: function(datestr) {
    //    pServerUTCTime	"2015-11-20T16:54:31.741652Z"
    var a = datestr.split("T");
    var d = a[0].split("-");
    var t = a[1].split(":");
    t[2] = t[2].replace("Z", "");
    var date = new Date(d[0], d[1] - 1, d[2], t[0], t[1], t[2]);
    return date;
  },

  gettimeinstate: function(eventtime, longestwaittime) {
    var fromTime = this.GetDateFromString(eventtime);
    var toTime = new Date();
    var differenceTravel =
      toTime.getTime() - fromTime.getTime() + datetimedelta;
    var seconds = Math.floor(differenceTravel / 1000) + longestwaittime;
    return seconds < 0 ? 0 : seconds;
  },

  serviceFactor: function(map, responseData) {
    return (
      this.GetDivisionValue(
        map["answeredCallsServiceThreasholdMetCount"],
        map["answeredCallsCount"]
      ) * 100
    ).toFixed(2);
  },

  GetAvgTime: function(AvgForAnwser, map, responseData) {
    map["rowUpdateTime"];

    if (AvgForAnwser) {
      return this.GetDivisionValue(
        map["answeredTotalCallsWaitingTime"],
        map["answeredCallsCount"]
      );
    } else {
      return this.GetDivisionValue(
        map["abandonedTotalCallsWaitingTime"],
        map["abandonedCallsCount"]
      );
    }
  },
  longestWaitTime: function(map, responseData) {
    if (map["currentCallsWaitingCount"] > 0) {
      return this.formatedTime(
        this.gettimeinstate(
          map["rowUpdateTime"],
          map["currentLongestWaitingTime"]
        )
      );
    } else {
      return this.formatedTime(0);
    }
  },

  callbackLongestWaitTime: function(map, responseData) {
    if (map["currentCallbacksWaitingCount"] > 0) {
      return this.formatedTime(
        this.gettimeinstate(
          map["rowUpdateTime"],
          map["currentCallbacksLongestWaitingTime"]
        )
      );
    } else {
      return this.formatedTime(0);
    }
  }
};

let tblCols = [
  {
    Header: "Queue Namfghfghhgfe",
    accessor: "queueName"
  },
  {
    Header: "Queueing",
    accessor: "currentCallsWaitingCount"
  },
  {
    Header: "Longest Wait Time",
    getValue: function(map, data) {
      return mapper_Fns.longestWaitTime(map, data);
    }
  },
  {
    Header: "Callback Queueing",
    accessor: "currentCallbacksWaitingCount"
  },
  {
    Header: "Callback Longest Wait Time",
    getValue: function(map, data) {
      return mapper_Fns.callbackLongestWaitTime(map, data);
    }
  },
  {
    Header: "Avg Answer Time",
    getValue: function(map, data) {
      return mapper_Fns.formatedTime(mapper_Fns.GetAvgTime(false, map, data));
    }
  },
  {
    Header: "Avg Abandoned Time",
    getValue: function(map, data) {
      return mapper_Fns.formatedTime(mapper_Fns.GetAvgTime(false, map, data));
    }
  },
  {
    Header: "Service Factor %",
    getValue: function(map, data) {
      return mapper_Fns.serviceFactor(map, data);
    }
  },
  {
    Header: "Offered",
    getValue: function(map, data) {
      return mapper_Fns.offered(map, data);
    }
  },
  {
    Header: "Answered",
    accessor: "answeredCallsCount"
  },
  {
    Header: "Abandoned",
    accessor: "abandonedCallsCount"
  },
  {
    Header: "Agent Did Not Answer",
    accessor: "agentDidNotAnswerCount"
  }
];

let rows = [
  {
    action: 0,
    Data: [
      137,
      "Noor campaign_Default",
      8,
      46,
      0,
      0,
      0,
      "2018-10-03T14:53:16.4278398Z",
      0,
      0
    ],
    PrimaryKey: "PK_7_137"
  }
];

// rows maps with cols

function testColMap(responseData) {
  const data = responseData[0].Data;

  const sver_cols = cols.map(item => {
    return item.Header;
  });

  const mappedRow = {};
  const jsonArr = sver_cols.map((item, i) => {
    const value = data[i];
    if (!mappedRow[item]) {
      mappedRow[item] = value;
    } else {
      mappedRow[item] = value;
    }
  });

  const new_value = tblCols.map((item, i, arr) => {
    const accessor = item.accessor
      ? item.accessor
      : item.getValue(mappedRow, data);
    const header = item.header || item.Name;

    return { Header: header, accessor: "" };
  });

  new_value;
  debugger;
}
//testColMap(rows);
