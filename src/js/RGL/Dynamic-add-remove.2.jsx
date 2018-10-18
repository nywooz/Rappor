import React, { Component } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const layout = getFromLS("items", "rgl-7") || [];
const layoutMap = getFromLS("layoutMap", "rgl-7.1") || [];

import Dustbin from "../Single Target/Dustbin";
import { iconsTypeMap } from "./Skeleton";
const cols = 12;

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
import { newGUID, resizeHChart, debounce } from "../commonFns";
import { get_endDragElement } from "../Single Target/Toolbox";

import GridItem from "../Chart/GridItem";
import Highchart1 from "../Chart/Demo/HighChart";
import Highchart2 from "../Chart/Demo/HighChart2";

import Griditem from "./Griditem";

export default class AddRemoveLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },

    // cols: { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
    rowHeight: 60
  };

  constructor(props) {
    super(props);

    this.state = {
      items: layout,
      layoutMap: layoutMap,
      newCounter: 0,
      selected: ""
    };
    this.HTMLcanvasRef = React.createRef();
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

  get_grid_item_info(el) {
    const item_info = this.state.layoutMap.find(function(item) {
      return el.i === item.i;
    });
    return item_info ? item_info : { uid: newGUID() };
  }

  createElement(el) {
    const removeStyle = {
      // // position: "absolute",
      // right: "5px",
      // // top: 0,
      // // cursor: "pointer"
      //  marginLeft: "auto",
      // marginRight: "5px"
    };

    const contentStyle = {
      // background: "#e3cdcd",
      // width: "100%",
      // height: "100%"
      height: "inherit"
    };

    const i = el.add ? "+" : el.i;

    el.y = el.y == null ? Infinity : el.y;

    const item_info = this.get_grid_item_info(el);
    const item_key = item_info.uid;

    // const layoutMap = this.state.layoutMap;
    // let item_info = layoutMap.find(function(item) {
    //   return item.i === key;
    // });

    return (
      <div
        style={{ height: "100%", width: "100%", position: "absolute" }}
        key={item_key}
        data-grid={el}
        className="container-fluid"
      >
        <div className="row">
          <div className="col-10" />
          <div
            className="col-2"
            style={removeStyle}
            onClick={this.onRemoveItem.bind(this, i)}
          >
            x
          </div>
        </div>
        <div className="w-100" />

        <div className="row" style={contentStyle}>
          {el.add ? (
            <div
              className="add text"
              onClick={this.onAddItem}
              title="You can add an item by clicking here, too."
            >
              Add +
            </div>
          ) : (
            <div style={contentStyle}>
              <GridItem
                ref={chart => {
                  this.ref_HighChart = chart;
                }}
                templateType={item_info.type}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  onAddItem(name) {
    const chartType = iconsTypeMap[name];
    const uid = newGUID();
    let i = uid; //"New " + this.state.newCounter;

    const oldLayout = this.state.items;
    var tileIndex = oldLayout.findIndex(function(item) {
      return i === item.i;
    });

    const width = 2;

    const newItem = {
      // uid: uid,
      // type: chartType,
      // name: name ? name : "",

      i: i,
      x: (this.state.items.length * width) % (this.state.cols || cols),
      y: Infinity, // puts it at the bottom
      w: width,
      h: 2
    };
    const all_items = oldLayout.concat(newItem);

    const old_MappedItem = this.state.layoutMap;
    const new_MappedItem = {
      uid: uid,
      type: chartType,
      name: name ? name : "",
      i: i
    };
    const all_MappedItem = old_MappedItem.concat(new_MappedItem);
    this.setState({
      items: all_items,
      newCounter: this.state.newCounter + 1,
      layoutMap: all_MappedItem
    });

    saveToLS("layout", all_items, "rgl-7");
    saveToLS("layoutMap", all_MappedItem, "rgl-7.1");
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onLayoutChange = layout => {
    this.props && this.props.onLayoutChange
      ? this.props.onLayoutChange(layout)
      : null;
    this.setState({ layout: layout });

    saveToLS("items", layout, "rgl-7");
    saveToLS("layoutMap", this.state.layoutMap, "rgl-7.1");
  };

  onRemoveItem(i) {
    console.log("removing", i);
    const oldItems = this.state.items;

    const newItems = _.reject(oldItems, { i: i });

    this.setState({ items: newItems });
    saveToLS("items", newItems, "rgl-7");
    this.updateLayoutMap({
      action: "remove",
      type: { UID: null, module: null, i: i, gridItem_i: i }
    });
  }

  updateLayoutMap = obj => {
    const type = obj.type;
    const gridItem_i = type.gridItem_i;
    const i = type.i;

    let newLayoutMap = this.state.layoutMap.slice(0);
    const index = newLayoutMap.findIndex(item => item.i === gridItem_i);

    if (index === -1 && (obj.action = "edit")) {
      obj.action = "add";
    }

    switch (obj.action) {
      case "add":
        if (index !== -1) return;
        const newItem = {
          dataModule: type.module,
          UID: type.UID,
          i: i,
          gridItem_i: gridItem_i
        };
        newLayoutMap = newLayoutMap.concat(newItem);
        break;

      case "edit":
        if (index === -1) return;
        newLayoutMap[index] = {
          dataModule: type.module,
          UID: type.UID,
          i: i,
          gridItem_i: type.new_gridItem_i
        };
        break;

      case "remove":
        if (index === -1) return;
        newLayoutMap = _.reject(newLayoutMap, { i: i });
        break;

      default:
        break;
    }

    if (obj.action) {
      this.setState({
        layoutMap: newLayoutMap
      });

      // saveToLS("layout", currentLayout, "rgl-1");
      saveToLS("layoutMap", newLayoutMap, "rgl-7.1");
    }
  };

  toolboxDrop() {
    console.log("toolboxDrop");
    this.onAddItem();
  }

  html_onDragEnter(e) {
    this.HTMLcanvasRef.current.classList.add("drophere");
    this.preventDefault(e);
    console.log("html_onDragEnter");
    // this.onAddItem();
  }

  html_onDragOver(e) {
    console.log("html_onDragOver");
  }

  preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  html_onDrop(e) {
    const props = get_endDragElement();
    if (props == undefined) {
      return;
      // user trying to drop a file in the drop area
    }

    console.log("html_onDrop");

    this.onAddItem(props.name);
    const HTMLcanvasRef_clssList = this.HTMLcanvasRef.current.classList;

    HTMLcanvasRef_clssList.contains("drophere")
      ? HTMLcanvasRef_clssList.remove("drophere")
      : null;
  }

  onDragStart(layout, oldItem, newItem, placeholder, e, element) {
    console.log("rgl: onDragStart");
  }
  // Calls on each drag movement.
  onDrag(layout, oldItem, newItem, placeholder, e, element) {
    console.log("rgl: onDrag");
  }
  // Calls when drag is complete.
  onDragStop(layout, oldItem, newItem, placeholder, e, element) {
    console.log("rgl: onDragStop");
  }
  // Calls when resize starts.
  onResizeStart(layout, oldItem, newItem, placeholder, e, element) {
    console.log("rgl: onResizeStart");
  }
  // Calls when resize movement happens.
  onResize(layout, oldItem, newItem, placeholder, e, element) {
    console.log("rgl: onResize");

    // this.ref_HighChart &&
    // this.ref_HighChart.ref_HighChart &&
    // this.ref_HighChart.ref_HighChart.ref_HighChart
    //   ? resizeHChart(this.ref_HighChart.ref_HighChart.ref_HighChart)
    //   : null;
  }
  // Calls when resize is complete.
  onResizeStop(layout, oldItem, newItem, placeholder, e, element) {
    console.log("rgl: onResizeStop");
  }

  // html_onDrag(e) {
  //   console.log("html: drag");
  // }
  // html_onDragEnd(e) {
  //   console.log("html: dragend");
  // }
  // html_onDragExit(e) {
  //   console.log("html: dragexit");
  // }
  html_onDragLeave(e) {
    console.log("html: drag leave");
  }
  // html_onDragStart(e) {
  //   console.log("html: drag start");
  // }

  onWidthChange(layout, oldItem, newItem, placeholder, e, element) {}

  render() {
    return (
      <div>
        {/*
        <button onClick={this.onAddItem}>Add Item</button>
         
        <Dustbin2 dropCallback={this.toolboxDrop}> </Dustbin2>
        */}

        <div
          ref={this.HTMLcanvasRef}
          // onDrag={e => this.html_onDrag(e)}
          // onDragEnd={e => this.html_onDragEnd(e)}
          // onDragExit={e => this.html_onDragExit(e)}
          onDragLeave={e => this.html_onDragLeave(e)}
          // onDragStart={e => this.html_onDragStart(e)}
          onDragEnter={e => this.html_onDragEnter(e)}
          onDragOver={e => this.preventDefault(e)}
          onDrop={e => this.html_onDrop(e)}
        >
          <ResponsiveReactGridLayout
            ref={this.canvasRef}
            onDragStart={this.onDragStart}
            onDrag={this.onDrag}
            onDragStop={this.onDragStop}
            onResizeStart={this.onResizeStart}
            onResize={this.onResize}
            onResizeStop={this.onResizeStop}
            onWidthChange={this.onWidthChange}
            onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}
            {...this.props}
          >
            {_.map(this.state.items, el => this.createElement(el))}
          </ResponsiveReactGridLayout>
        </div>
      </div>
    );
  }
}

function getFromLS(prop, key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(key)) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  //return [];
  return ls[prop];
}

function saveToLS(valueKey, value, key) {
  if (global.localStorage) {
    global.localStorage.setItem(
      key,
      JSON.stringify({
        [valueKey]: value
      })
    );
  }
}

// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, "findIndex", {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== "function") {
        throw new TypeError("predicate must be a function");
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, "find", {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== "function") {
        throw new TypeError("predicate must be a function");
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return (
          x === y ||
          (typeof x === "number" &&
            typeof y === "number" &&
            isNaN(x) &&
            isNaN(y))
        );
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1.
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}
