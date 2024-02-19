import "@fontsource/inter/latin-700.css";
import { styleSheet } from "./css";

import { render } from "solid-js/web";
import App from "./App";

render(
  () => (
    <>
      {/* eslint-disable-next-line solid/no-innerhtml */}
      <style innerHTML={styleSheet()} />
      <App />
    </>
  ),
  document.getElementById("root")!,
);
