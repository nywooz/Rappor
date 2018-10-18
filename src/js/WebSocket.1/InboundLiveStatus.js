import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";

class InboundLiveStatusTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.data, cols: this.props.columns };
  }

  // fires when component is receiving new props
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      cols: nextProps.columns
    });
  }

  render() {
    const { data, cols } = this.state;
    return (
      <div>
        <p>ReactTable test</p>
        <ReactTable
          noDataText={"No rows found"}
          minRows={3}
          defaultPageSize={10}
          previousText={"<"}
          nextText={">"}
          data={data}
          columns={cols}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}

const requestCols = [
  "queueId",
  "queueName",
  "currentCallsWaitingCount",
  "currentLongestWaitingTime",
  "currentTotalAgentReadyCount",
  "currentTotalAgentNotReadyCount",
  "currentTotalAgentTalkingCount",
  "rowUpdateTime",
  "currentCallbacksWaitingCount",
  "currentCallbacksLongestWaitingTime"
];

const TablesToDisplay = {
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
    Columns: requestCols
  }
};

let datetimedelta = 0;

const mapper_Fns = {
  getMainCategoryColumn: function (responseName) {
    const map = {
      InboundLiveStatus: "queueName"
    };
    return map[responseName];
  },
  GetDivisionValue: function (Dividend, Divisor) {
    if (Divisor != 0) {
      return Dividend / Divisor;
    }
    return 0;
  },
  offered: function (map, responseData) {
    return (
      map["currentCallsWaitingCount"] +
      map["answeredCallsCount"] +
      map["abandonedCallsCount"] +
      map["dequeuedCallsCount"]
    );
  },

  formatedTime: function (seconds) {
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

  GetDateFromString: function (datestr) {
    //    pServerUTCTime	"2015-11-20T16:54:31.741652Z"
    var a = datestr.split("T");
    var d = a[0].split("-");
    var t = a[1].split(":");
    t[2] = t[2].replace("Z", "");
    var date = new Date(d[0], d[1] - 1, d[2], t[0], t[1], t[2]);
    return date;
  },

  gettimeinstate: function (eventtime, longestwaittime) {
    var fromTime = this.GetDateFromString(eventtime);
    var toTime = new Date();
    var differenceTravel =
      toTime.getTime() - fromTime.getTime() + datetimedelta;
    var seconds = Math.floor(differenceTravel / 1000) + longestwaittime;
    return seconds < 0 ? 0 : seconds;
  },

  serviceFactor: function (map, responseData) {
    return (
      this.GetDivisionValue(
        map["answeredCallsServiceThreasholdMetCount"],
        map["answeredCallsCount"]
      ) * 100
    ).toFixed(2);
  },

  GetAvgTime: function (AvgForAnwser, map, responseData) {
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
  longestWaitTime: function (map, responseData) {
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

  callbackLongestWaitTime: function (map, responseData) {
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

const tblCols = [
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
    getValue: function (map, data) {
      return mapper_Fns.longestWaitTime(map, data);
    }
  },
  {
    Header: "Callback Queueing",
    accessor: "currentCallbacksWaitingCount"
  },
  {
    Header: "Callback Longest Wait Time",
    getValue: function (map, data) {
      return mapper_Fns.callbackLongestWaitTime(map, data);
    }
  },
  {
    Header: "Avg Answer Time",
    getValue: function (map, data) {
      return mapper_Fns.formatedTime(mapper_Fns.GetAvgTime(false, map, data));
    }
  },
  {
    Header: "Avg Abandoned Time",
    getValue: function (map, data) {
      return mapper_Fns.formatedTime(mapper_Fns.GetAvgTime(false, map, data));
    }
  },
  {
    Header: "Service Factor %",
    getValue: function (map, data) {
      return mapper_Fns.serviceFactor(map, data);
    }
  },
  {
    Header: "Offered",
    getValue: function (map, data) {
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

export { tblCols, InboundLiveStatusTable, TablesToDisplay };
