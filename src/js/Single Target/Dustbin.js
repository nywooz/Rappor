import React, { Component } from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import ItemTypes from "./ItemTypes";

const style = {
  // height: '12rem',
  // width: '12rem',
  // marginRight: '1.5rem',
  // marginBottom: '1.5rem',
  // textAlign: 'center',
  // fontSize: '1rem',
  // lineHeight: 'normal',
  // float: 'left',

  color: "white",
  padding: "1rem",

  backgroundColor: "#2222",
  zIndex: "999999999",
  // height: "100%",
  // width: "100%",
  // position: "absolute"

  activeColor: "darkgreen",
  candropColor: "darkkhaki"
};

const boxTarget = {
  drop(props, monitor, component) {
    props && props.dropCallback ? props.dropCallback() : null;
    return { name: "Dustbin" };
  }
};

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class Dustbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  };


  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor = style.backgroundColor;

    if (isActive) {
      backgroundColor = style.activeColor;
    } else if (canDrop) {
      backgroundColor = style.candropColor;
    }

    return connectDropTarget(
      <div style={{ ...style, backgroundColor }}>
        {isActive ? "Release to drop" : "React DnD Drag a box here"}
      </div>
    );
  }
}
