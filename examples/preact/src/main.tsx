import "@fontsource/inter/latin-700.css";

import { render } from "preact";
import App from "./App";
import { styleSheet } from "./css";

render(
  <>
    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </>,
  document.getElementById("root")!,
);
