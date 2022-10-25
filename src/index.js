import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
//import Login from "./Login/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>

  /*
  <React.StrictMode>
    <Login></Login>
  </React.StrictMode>
  */
);
