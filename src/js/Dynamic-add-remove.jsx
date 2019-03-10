import React from "react";

import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import { iconsTypeMap, gridTypes } from "../data/gridTypes";
import { newGUID } from "./commonFns";
import GridItem from "./Chart/GridItem";
import FloatingActionButton from "./FloatingActionButton";
import TileMenu from "./TileMenu";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FAIcon from "./FAIcon";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const layout = getFromLS("items", "rgl-7") || [];
const layoutMap = getFromLS("layoutMap", "rgl-7.1") || [];

export default class AddRemoveLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
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
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
  }

  get_grid_item_info = el => {
    const item_info = this.state.layoutMap.find(function(item) {
      return el.i === item.i;
    });
    return item_info ? item_info : { uid: newGUID() };
  };

  onToggleStatic = i => {
    let newLayout = this.state.layout.slice(0);
    const index = newLayout.findIndex(item => item.i === i);
    if (index === -1) return;
    const prevStaticVal = newLayout[index].static;
    newLayout[index].static = !prevStaticVal;
    this.setState({ layout: newLayout });
    saveToLS("items", layout, "rgl-7");
  };

  createElement = el => {
    const contentStyle = {
      height: "inherit"
    };

    const i = el.add ? "+" : el.i;

    el.y = el.y == null ? Infinity : el.y;

    const item_info = this.get_grid_item_info(el);
    const item_key = item_info.uid;

    return (
      <div
        style={{ height: "100%", width: "100%", position: "absolute" }}
        key={item_key}
        data-grid={el}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "2px"
          }}
        >
          <IconButton
            aria-label="Delete"
            style={{ display: "inline-block" }}
            onClick={this.onRemoveItem.bind(this, i)}
          >
            <DeleteIcon style={{ fontSize: 16 }} />
          </IconButton>

          <IconButton
            aria-label="Toggle Static"
            style={{ display: "inline-block", width: "40px" }}
            onClick={this.onToggleStatic.bind(this, i)}
          >
            {el.static ? (
              <FAIcon
                style={{ fontSize: 16 }}
                icon={["fa", "thumbtack"]}
                size="xs"
                rotation={90}
              />
            ) : (
              <FAIcon
                style={{ fontSize: 16 }}
                icon={["fa", "thumbtack"]}
                size="xs"
              />
            )}
          </IconButton>
        </div>

        <div className="container-fluid">
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
      </div>
    );
  };

  onAddItem = (name = "") => {
    const chartType =
      typeof name === "string" && name.length !== 0
        ? iconsTypeMap[name]
        : gridTypes.highcharts[
            (Math.random() * gridTypes.highcharts.length) | 0
          ];

    const uid = newGUID();
    let i = uid;

    const oldLayout = this.state.items;
    const width = 2;
    const newItem = {
      i: i,
      x: (this.state.items.length * width) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: width,
      h: 2
    };
    const all_items = oldLayout.concat(newItem);

    const old_MappedItem = this.state.layoutMap;
    const new_MappedItem = {
      uid: uid,
      type: chartType,
      name: typeof name === "string" ? name : "",
      i: i
    };
    const all_MappedItem = old_MappedItem.concat(new_MappedItem);
    this.setState({
      items: all_items,
      newCounter: this.state.newCounter + 1,
      layoutMap: all_MappedItem
    });
  };

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  };

  onLayoutChange = layout => {
    const changedLayout =
      this.props && this.props.onLayoutChange
        ? this.props.onLayoutChange(layout)
        : null;
    this.setState({ layout: layout });

    saveToLS("items", layout, "rgl-7");
    saveToLS("layoutMap", this.state.layoutMap, "rgl-7.1");
  };

  onRemoveItem = i => {
    const oldItems = this.state.items;
    const newItems = _.reject(oldItems, { i: i });

    this.setState({ items: newItems });
    saveToLS("items", newItems, "rgl-7");
    this.updateLayoutMap({
      action: "remove",
      type: { UID: null, module: null, i: i, gridItem_i: i }
    });
  };

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
      saveToLS("layoutMap", newLayoutMap, "rgl-7.1");
    }
  };

  render() {
    return (
      <div>
        <FloatingActionButton
          onClick={e => {
            this.onAddItem();
          }}
        />
        <div ref={this.HTMLcanvasRef}>
          <ResponsiveReactGridLayout
            ref={this.canvasRef}
            onDragStart={this.onDragStart}
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
