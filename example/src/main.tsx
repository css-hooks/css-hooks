import "@fontsource/inter/latin-700.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app.tsx";
import { styleSheet } from "./css.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </React.StrictMode>,
);
