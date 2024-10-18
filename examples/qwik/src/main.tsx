import "@fontsource/inter/latin-700.css";
import "@builder.io/qwik/qwikloader.js";

import { render } from "@builder.io/qwik";

import { App } from "./app.js";
import { styleSheet } from "./css.js";

render(
  document.getElementById("root")!,
  <>
    <style dangerouslySetInnerHTML={styleSheet()} />
    <App />
  </>,
);
