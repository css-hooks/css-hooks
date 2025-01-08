import type { CSSProperties } from "react";
import { pipe } from "remeda";
import * as V from "varsace";

import { dark, on } from "../css.ts";
import { Emblem } from "./emblem.tsx";

export function Logo({ size = "2rem" }: { size?: CSSProperties["fontSize"] }) {
  return (
    <div
      style={{
        fontFamily: "'Assistant Variable', 'Assistant', sans-serif",
        fontSize: size,
        letterSpacing: "-0.05em",
        display: "flex",
        alignItems: "center",
        gap: "0.125em",
        lineHeight: 1,
      }}
    >
      <Emblem />
      <div
        style={pipe(
          {
            color: V.gray90,
          },
          on(dark, {
            color: V.white,
          }),
        )}
      >
        CSS Hooks
      </div>
    </div>
  );
}
