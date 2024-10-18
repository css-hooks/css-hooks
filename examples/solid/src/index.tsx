import "@fontsource/inter/latin-700.css";

import { render } from "solid-js/web";

import { App } from "./app.jsx";
import { styleSheet } from "./css.js";

render(
  () => (
    <>
      <style innerHTML={styleSheet()} />
      <App />
    </>
  ),
  document.getElementById("root")!,
);
