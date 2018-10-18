import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            data: []
        };
        this.makeAgain = this.makeAgain.bind(this);
    }

    makeAgain() {
        const oldData = this.state.data;

        const newData = oldData.map(function (i, key, list) {

            const progress = i.progress = Math.floor(Math.random() * 100) + 1


            return { ...i, ...progress };
        })



        this.setState({
            data: newData
        });
    }
    componentWillMount() {
        this.setState({
            data: makeData()
        });
        setInterval(this.makeAgain, 2000);
    }

    render() {
        const { data } = this.state;
        return (
            <div>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: "Name",
                            columns: [
                                {
                                    Header: "First Name",
                                    accessor: "firstName"
                                },
                                {
                                    Header: "Last Name",
                                    id: "lastName",
                                    accessor: d => d.lastName
                                }
                            ]
                        },
                        {
                            Header: "Info",
                            columns: [
                                {
                                    Header: "Profile Progress",
                                    accessor: "progress",
                                    Cell: row => (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                backgroundColor: "#dadada",
                                                borderRadius: "2px"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${row.value}%`,
                                                    height: "100%",
                                                    backgroundColor:
                                                        row.value > 66
                                                            ? "#85cc00"
                                                            : row.value > 33
                                                                ? "#ffbf00"
                                                                : "#ff2e00",
                                                    borderRadius: "2px",
                                                    transition: "all .5s ease-out"
                                                }}
                                            />
                                        </div>
                                    )
                                },
                                {
                                    Header: "Status",
                                    accessor: "status",
                                    Cell: row => (
                                        <span>
                                            <span
                                                style={{
                                                    color:
                                                        row.value === "relationship"
                                                            ? "#ff2e00"
                                                            : row.value === "complicated"
                                                                ? "#ffbf00"
                                                                : "#57d500",
                                                    transition: "all .5s ease"
                                                }}
                                            >
                                                &#x25cf;
                      </span>{" "}
                                            {row.value === "relationship"
                                                ? "In a relationship"
                                                : row.value === "complicated"
                                                    ? `It's complicated`
                                                    : "Single"}
                                        </span>
                                    )
                                }
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
                <br />
            </div>
        );
    }
}

render(<App />, document.getElementById("root"));
