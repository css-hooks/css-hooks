import "./index.css";

import { render } from "preact";
import App from "./App.tsx";
import { css } from "./css-hooks.ts";

render(
  <>
    <style>{css}</style>
    <App />
  </>,
  document.getElementById("root")!,
);
