import React from "react";
import ReactDOM from "react-dom";
import Hoc from "./Hoc1";



const App = ({ name }) => (
  <div className="container-fluid">
    <h2> Higher-Order Components</h2>
    <p>
      A higher-order component ({name}) is an advanced technique in React for
      reusing component logic. HOCs are not part of the React API, per se. They
      are a pattern that emerges from React’s compositional nature
    </p>

    <p>
      Concretely, a higher-order component is a function that takes a component
      and returns a new component.
    </p>

    <code>
      const EnhancedComponent = higherOrderComponent(WrappedComponent);
    </code>

    <div>
      <Hoc />
      
    </div>
  </div>
);

export default App;

/**
 *
 *
 *
 *
 *
 *
 *
 */
