import "@fontsource/inter/latin-700.css";
import "@builder.io/qwik/qwikloader.js";

import { styleSheet } from "./css";

import { render } from "@builder.io/qwik";
import App from "./App";

render(
  document.getElementById("root")!,
  <>
    <style dangerouslySetInnerHTML={styleSheet()} />
    <App />
  </>,
);
