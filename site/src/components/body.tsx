import type { JSXChildren } from "hastx/jsx-runtime";
import { pipe } from "remeda";
import * as V from "varsace";

import { dark, on } from "../css.js";

export function Body({
  children,
  transparent,
}: {
  children?: JSXChildren;
  transparent?: boolean;
}) {
  return (
    <body
      style={pipe(
        {
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.25,
          margin: 0,
          background: transparent ? "revert" : V.white,
          color: V.gray90,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        },
        on(dark, {
          background: V.gray90,
          color: V.white,
        }),
      )}
    >
      {children}
    </body>
  );
}
