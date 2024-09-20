import type { CSSProperties } from "hastx/css";
import { pipe } from "remeda";
import * as V from "varsace";

import { dark, on } from "../css.js";
import { Emblem } from "./emblem.js";

export function Logo({
  size = "2rem",
  theme = "auto",
}: {
  size?: CSSProperties["fontSize"];
  theme?: "dark" | "light" | "auto";
}) {
  const lightColor = V.gray90;
  const darkColor = V.white;
  const color = theme === "dark" ? darkColor : lightColor;
  return (
    <div
      style={{
        fontFamily: "'Assistant', sans-serif",
        fontSize: size,
        letterSpacing: "-0.05em",
        display: "flex",
        alignItems: "center",
        gap: "0.125em",
        lineHeight: 1,
      }}
    >
      <Emblem theme={theme} />
      <div
        style={
          theme === "auto"
            ? pipe(
                {
                  color: lightColor,
                },
                on(dark, {
                  color: darkColor,
                }),
              )
            : { color }
        }
      >
        CSS Hooks
      </div>
    </div>
  );
}
