import "@fontsource/inter/latin-700.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app.js";
import { styleSheet } from "./css.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </React.StrictMode>,
);
