import { pipe } from "remeda";

import { black, blue, gray, red, white } from "./colors.ts";
import { and, on } from "./css.ts";
import { Logo } from "./logo.tsx";

export function App() {
  return (
    <div
      style={pipe(
        {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: white,
          color: black,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        on("@media (prefers-color-scheme: dark)", {
          background: black,
          color: white,
        }),
      )}
    >
      <div style={{ fontSize: 192 }}>
        <Logo />
      </div>
      <a
        href="https://css-hooks.com/docs"
        style={pipe(
          {
            fontFamily: "Inter, sans-serif",
            fontSize: "1.333rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            border: 0,
            textDecoration: "none",
            background: gray(60),
            color: white,
            padding: "0.5em 0.75em",
            display: "inline-block",
          },
          on("&:hover", {
            background: blue(50),
          }),
          on("&:active", {
            background: red(50),
          }),
          on("@media (prefers-color-scheme: dark)", {
            background: gray(70),
          }),
          on(and("@media (prefers-color-scheme: dark)", "&:hover"), {
            background: blue(50),
          }),
          on(and("@media (prefers-color-scheme: dark)", "&:active"), {
            background: red(50),
          }),
        )}
      >
        Get started
      </a>
    </div>
  );
}
