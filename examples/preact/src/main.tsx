import "@fontsource/inter/latin-700.css";

import { render } from "preact";
import App from "./App";
import { styleSheet } from "./css";

render(
  <>
    {/* eslint-disable-next-line react/no-danger */}
    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </>,
  document.getElementById("root")!,
);
