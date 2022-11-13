import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

//import Login from "./components/Login/Login";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./store/auth-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>
  //<Login></Login>
);
