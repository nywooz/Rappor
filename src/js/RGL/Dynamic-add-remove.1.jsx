import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayout = getFromLS("items") || [];

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */

export default class AddRemoveLayout extends React.Component  {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 80
  };

  constructor(props) {
    super(props);

    this.state = {
      items: originalLayout,
      // items: [0, 1, 2].map(function(i, key, list) {
      //   return {
      //     name: i.toString(),
      //     i: i.toString(),
      //     x: i,
      //     y: 0,
      //     w: 1,
      //     h: 1,
      //     add: i === (list.length - 1).toString()
      //   };
      // }),
      newCounter: 0
    };
    this.canvasRef = React.createRef();

    this.onDragStart = this.onDragStart.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);
    this.toolboxDrop = this.toolboxDrop.bind(this);

    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
  }

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
    const i = el.add ? "+" : el.i;
    return (
      <div key={i} data-grid={el}>
        {el.add ? (
          <span
            className="add text"
            onClick={this.onAddItem}
            title="You can add an item by clicking here, too."
          >
            Add +
          </span>
        ) : (
          <span className="text">
            {i} {el.name && el.name !== i ? " " + el.name : ""}
          </span>
        )}
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          x
        </span>
      </div>
    );
  }

  onAddItem(name) {
    /*eslint no-console: 0*/
    console.log("adding", "n" + this.state.newCounter);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        name: name ? name : "",
        i: "n" + this.state.newCounter,
        x: this.state.items.length % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 1,
        h: 1
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1
    });
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onLayoutChange(layout) {
    saveToLS("items", layout);

    // this.props && this.props.onLayoutChange
    //   ? this.props.onLayoutChange(layout)
    //   : null;

    this.setState({ items: layout });
  }

  onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ items: _.reject(this.state.items, { i: i }) });
  }

  render() {
    return (
      <div>
        <button onClick={this.onAddItem}>Add Item</button>

        <ResponsiveReactGridLayout
          ref={this.canvasRef}
          onDragStart={this.onDragStart}
          onDrag={this.onDrag}
          onDragStop={this.onDragStop}
          onResizeStart={this.onResizeStart}
          onResize={this.onResize}
          onResizeStop={this.onResizeStop}
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          {...this.props}
        >
          {_.map(this.state.items, el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-7")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-7",
      JSON.stringify({
        [key]: value
      })
    );
  }
}
