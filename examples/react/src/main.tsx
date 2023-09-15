import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { css } from "./css-hooks.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <style>{css}</style>
    <App />
  </React.StrictMode>,
);
