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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        on: $ => [
          $("@media (prefers-color-scheme: dark)", {
            background: V.black,
            color: V.white,
          }),
        ],
      })}
    >
      <div style={{ fontSize: 192 }}>
        <Logo />
      </div>
      <a
        href="https://css-hooks.com/docs/preact/getting-started"
        style={css({
          fontFamily: "Inter, sans-serif",
          fontSize: "1.333rem",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          border: 0,
          textDecoration: "none",
          background: V.gray50,
          color: V.white,
          padding: "0.5em 0.75em",
          display: "inline-block",
          on: ($, { and }) => [
            $("&:hover", {
              background: V.blue40,
            }),
            $("&:active", {
              background: V.red40,
            }),
            $("@media (prefers-color-scheme: dark)", {
              background: V.gray70,
            }),
            $(and("@media (prefers-color-scheme: dark)", "&:hover"), {
              background: V.blue50,
            }),
            $(and("@media (prefers-color-scheme: dark)", "&:active"), {
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
