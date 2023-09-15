import "./index.css";
import { css } from "./css-hooks";

import { render } from "solid-js/web";
import App from "./App";

render(
  () => (
    <>
      <style>{css}</style>
      <App />
    </>
  ),
  document.getElementById("root")!,
);
