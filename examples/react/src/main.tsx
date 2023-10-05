import "@fontsource/inter/latin-700.css";
import { css } from "./css-hooks";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <style>{css}</style>
    <App />
  </React.StrictMode>,
);
