import "./index.css";

import { render } from "preact";
import App from "./App";
import { css } from "./css-hooks";

render(
  <>
    <style>{css}</style>
    <App />
  </>,
  document.getElementById("root")!,
);
