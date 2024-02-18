import { css } from "~/css";
import { type CSSProperties, component$ } from "@builder.io/qwik";
import { Emblem } from "./emblem";
import * as V from "varsace";

export const Logo = component$(
  ({
    size = "2rem",
    theme = "auto",
  }: {
    size?: CSSProperties["fontSize"];
    theme?: "dark" | "light" | "auto";
  }) => {
    const light = V.gray90;
    const dark = V.white;
    const color = theme === "dark" ? dark : light;
    return (
      <div
        style={{
          fontFamily: "'Assistant Variable'",
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
  },
);
