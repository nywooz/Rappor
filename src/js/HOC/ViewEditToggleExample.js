import React from "react";
import withToggle from "./ToggleHOC";

// https://medium.com/@onoufriosm/real-world-examples-of-higher-order-components-hoc-for-react-871f0d8b39d8
const ViewEditToggleExample = ({ toggle, toggleStatus, title }) => (
  <div>
    {toggleStatus ? <input type="text" value={title} /> : <p>{title}</p>}
    <button onClick={toggle}>{toggleStatus ? "Cancel" : "Edit"}</button>
  </div>
);

export default withToggle(ViewEditToggleExample);
