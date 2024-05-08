import { JSXChildren } from "hastx/jsx-runtime";
import { css } from "../css.js";
import * as V from "varsace";

export function Body({
  children,
  transparent,
}: {
  children?: JSXChildren;
  transparent?: boolean;
}) {
  return (
    <body
      style={css({
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.25,
        margin: 0,
        background: transparent ? "revert" : V.white,
        color: V.gray90,
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        on: $ => [
          $("@media (prefers-color-scheme: dark)", {
            background: V.gray90,
            color: V.white,
          }),
        ],
      })}
    >
      {children}
    </body>
  );
}
