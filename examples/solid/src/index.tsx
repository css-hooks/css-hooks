import "@fontsource/inter/latin-700.css";
import { hooks } from "./css";

import { render } from "solid-js/web";
import App from "./App";

render(
  () => (
    <>
      {/* eslint-disable-next-line solid/no-innerhtml */}
      <style innerHTML={hooks} />
      <App />
    </>
  ),
  document.getElementById("root")!,
);
