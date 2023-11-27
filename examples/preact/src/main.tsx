import "@fontsource/inter/latin-700.css";

import { render } from "preact";
import App from "./App";
import { css } from "./css-hooks";

render(
  <>
    {/* eslint-disable-next-line react/no-danger */}
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <App />
  </>,
  document.getElementById("root")!,
);
