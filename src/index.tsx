import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";

import "normalize.css";
import "@sass/_global.scss";

ReactDOM.render(
  <App />,
  document.querySelector("#root")
);
