import "@fontsource/inter/latin-700.css";

import { render } from "preact";

import { App } from "./app.js";
import { styleSheet } from "./css.js";

render(
  <>
    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </>,
  document.getElementById("root")!,
);
