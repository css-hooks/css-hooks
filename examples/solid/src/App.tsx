import * as V from "varsace";
import Logo from "./Logo";
import { css } from "./css";

function App() {
  return (
    <div
      style={css({
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: V.white,
        color: V.black,
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center",
        match: on => [
          on("@media (prefers-color-scheme: dark)", {
            background: V.black,
            color: V.white,
          }),
        ],
      })}
    >
      <div style={{ "font-size": "192px" }}>
        <Logo />
      </div>
      <a
        href="https://css-hooks.com/docs/solid/getting-started"
        style={css({
          "font-family": "Inter, sans-serif",
          "font-size": "1.333rem",
          "font-weight": 700,
          "letter-spacing": "-0.03em",
          border: 0,
          "text-decoration": "none",
          background: V.gray50,
          color: V.white,
          padding: "0.5em 0.75em",
          display: "inline-block",
          match: (on, { all }) => [
            on("&:hover", {
              background: V.blue40,
            }),
            on("&:active", {
              background: V.red40,
            }),
            on("@media (prefers-color-scheme: dark)", {
              background: V.gray70,
            }),
            on(all("@media (prefers-color-scheme: dark)", "&:hover"), {
              background: V.blue50,
            }),
            on(all("@media (prefers-color-scheme: dark)", "&:active"), {
              background: V.red50,
            }),
          ],
        })}
      >
        Get started
      </a>
    </div>
  );
}

export default App;
