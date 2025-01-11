import type { CSSProperties } from "react";
import { pipe } from "remeda";

import { dark, on } from "../css.ts";
import { gray, white } from "../design/colors.ts";
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
            color: gray(70),
          },
          on(dark, {
            color: white,
          }),
        )}
      >
        CSS Hooks
      </div>
    </div>
  );
}
