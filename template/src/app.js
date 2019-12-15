import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return <div style={mainStyles}>Hello from React!</div>;
};

const mainStyles = {
  color: "#f65c78",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "600px",
  fontSize: "24px"
};

ReactDOM.render(<App />, document.getElementById("app"));
