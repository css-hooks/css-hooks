import "@fontsource/inter/latin-700.css";
import { hooks } from "./css";

import { render } from "solid-js/web";
import App from "./App";

render(
  () => (
    <>
      <style>{hooks}</style>
      <App />
    </>
  ),
  document.getElementById("root")!,
);
