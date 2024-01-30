import "@fontsource/inter/latin-700.css";
import { styleSheet } from "./css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </React.StrictMode>,
);
