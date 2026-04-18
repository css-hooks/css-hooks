import { useState } from "react";
import { pipe } from "remeda";

import { and, dark, not, on } from "./css.ts";
import { Portrait } from "./portrait.tsx";
import { ThemeSwitcher } from "./theme-switcher.tsx";

const warm = (l: number) => `oklch(${l}% 0.025 80)`;
const cool = (l: number) => `oklch(${l}% 0.015 260)`;

export function App() {
  const [theme, setTheme] = useState<"dark" | "auto" | "light">("auto");
  return (
    <div className={theme}>
      <div
        style={pipe(
          {
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: 32,
            boxSizing: "border-box",
            background: warm(93),
            fontFamily: "sans-serif",
          },
          on(dark, {
            background: cool(11),
          }),
        )}
      >
        <article
          style={pipe(
            {
              display: "flex",
              maxWidth: 460,
              width: "100%",
              background: warm(99),
              border: `1px solid ${warm(84)}`,
              borderRadius: 6,
              boxShadow: "0 2px 10px oklch(0% 0 0 / 0.07)",
              overflow: "hidden",
              cursor: "default",
            },
            on("&:hover", {
              boxShadow: "0 8px 28px oklch(0% 0 0 / 0.13)",
            }),
            on(and("&:hover", not("@media (prefers-reduced-motion: reduce)")), {
              transform: "translateY(-4px)",
            }),
            on(not("@media (prefers-reduced-motion: reduce)"), {
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }),
            on(dark, {
              background: cool(17),
              border: `1px solid ${cool(27)}`,
              boxShadow: "0 2px 10px oklch(0% 0 0 / 0.35)",
            }),
            on(and("&:hover", dark), {
              boxShadow: "0 8px 28px oklch(0% 0 0 / 0.55)",
            }),
          )}
        >
          {/* Portrait */}
          <div style={{ flexShrink: 0, width: 150, alignSelf: "stretch" }}>
            <Portrait />
          </div>

          {/* Quote */}
          <div
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1.25em",
            }}
          >
            <blockquote
              style={pipe({
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.25em",
              })}
            >
              <span
                aria-hidden="true"
                style={pipe(
                  {
                    fontFamily: "serif",
                    fontSize: "3.5em",
                    lineHeight: 1,
                    color: warm(78),
                    userSelect: "none",
                    display: "block",
                  },
                  on(dark, {
                    color: cool(38),
                  }),
                )}
              >
                &ldquo;
              </span>
              <p
                style={pipe(
                  {
                    margin: 0,
                    fontFamily: "serif",
                    lineHeight: 1.65,
                    fontStyle: "italic",
                    color: cool(20),
                  },
                  on(dark, {
                    color: warm(92),
                  }),
                )}
              >
                Simplicity is the ultimate sophistication.
              </p>
            </blockquote>

            <cite
              style={pipe(
                {
                  fontStyle: "normal",
                  fontSize: "0.72em",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: warm(60),
                },
                on(dark, {
                  color: cool(55),
                }),
              )}
            >
              Leonardo da Vinci
            </cite>
          </div>
        </article>

        <ThemeSwitcher value={theme} onChange={setTheme} />
      </div>
    </div>
  );
}
