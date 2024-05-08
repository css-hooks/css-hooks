import { CSSProperties } from "hastx/css";
import { css } from "../css.js";
import { Emblem } from "./emblem.js";
import * as V from "varsace";

export function Logo({
  size = "2rem",
  theme = "auto",
}: {
  size?: CSSProperties["fontSize"];
  theme?: "dark" | "light" | "auto";
}) {
  const light = V.gray90;
  const dark = V.white;
  const color = theme === "dark" ? dark : light;
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
            ? css({
                color: light,
                on: $ => [
                  $("@media (prefers-color-scheme: dark)", {
                    color: dark,
                  }),
                ],
              })
            : { color }
        }
      >
        CSS Hooks
      </div>
    </div>
  );
}
