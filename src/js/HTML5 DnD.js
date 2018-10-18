import React, { Component } from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";

const style = {
  border: "1px dashed gray",
  // padding: "0.5rem 1rem",
  // marginRight: "1.5rem",
  marginBottom: "0.5rem",
  cursor: "move",
  float: "left"
};

export default class AppDragDropDemo extends Component {
  render() {
    const { name, onClick } = this.props;

    return (
      <Box name={name} onClick={onClick}>
        {name}
      </Box>
    );
  }
}

export class Box extends Component {
  onDragStart(e, name) {
    set_endDragElement({
      name: name
    });
    return {
      name: name
    };
  }

  render() {
    const { isDragging } = this.props;
    const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      <div
        draggable
        className="draggable"
        onDragStart={e => this.onDragStart(e, name)}
        onClick={this.props.onClick.bind(name)}
        style={{ ...style, opacity }}
        //onDoubleClick={this.props.onClick}
      >
        <div style={icon_div_style}>
          <i className={"fas " + name + " fa-3x "} />
        </div>
      </div>
    );
  }
}

import { set_endDragElement } from "../js/Single Target/Toolbox";

const icon_div_style = {
  width: "fit-content",
  background: "#eaeaea"
};
