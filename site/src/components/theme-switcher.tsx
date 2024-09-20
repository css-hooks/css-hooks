import { pipe } from "remeda";
import * as V from "varsace";

import { and, dark, hover, not, on } from "../css.js";
import * as Icon from "./icons.js";
import { ScreenReaderOnly } from "./screen-reader-only.js";

const themes = ["light", "auto", "dark"] as const;
const defaultTheme: (typeof themes)[number] = "auto";
const switcherId = "global-theme-switcher";

export function ThemeSwitcherScript() {
  return (
    <script>
      {`
        (function() {
          var theme = localStorage.getItem("theme");
          if (!~${JSON.stringify(themes)}.indexOf(theme)) {
            theme = ${JSON.stringify(defaultTheme)};
          }
          document.documentElement.setAttribute("data-theme", theme);
          window.addEventListener("load", function() {
            var switcher = document.getElementById(${JSON.stringify(
              switcherId,
            )});
            if (switcher instanceof HTMLSelectElement) {
              switcher.value = theme;
              switcher.addEventListener("change", function(e) {
                var theme = e.target.value;
                document.documentElement.setAttribute("data-theme", theme);
                localStorage.setItem("theme", theme);
              });
            }
          });
        })()
      `}
    </script>
  );
}

export function ThemeSwitcher() {
  return (
    <div
      style={pipe(
        {
          position: "relative",
          display: "inline-flex",
          outlineWidth: 0,
          outlineStyle: "solid",
          outlineColor: V.blue20,
          outlineOffset: 2,
          color: V.blue50,
        },
        on("&:has(:focus-visible)", {
          outlineWidth: 2,
        }),
        on(hover, {
          color: V.blue40,
        }),
        on("&:active", {
          color: V.red40,
        }),
        on(dark, {
          outlineColor: V.blue50,
          color: V.blue30,
        }),
        on(and(dark, hover), {
          color: V.blue20,
        }),
        on(and(dark, "&:active"), {
          color: V.red20,
        }),
      )}
    >
      <div style={{ display: "inline-flex" }}>
        <div
          style={pipe(
            {
              display: "none",
            },
            on(dark, {
              display: "contents",
            }),
          )}
        >
          <Icon.DarkMode />
        </div>
        <div
          style={pipe(
            {
              display: "none",
            },
            on(not(dark), {
              display: "contents",
            }),
          )}
        >
          <Icon.LightMode />
        </div>
        <Icon.ArrowDropDown />
      </div>
      <label>
        <ScreenReaderOnly>Theme</ScreenReaderOnly>
        <select
          id={switcherId}
          style={{
            fontSize: 0,
            position: "absolute",
            inset: 0,
            opacity: 0,
          }}
        >
          {themes.map(theme => (
            <option
              selected={theme === defaultTheme}
              style={{
                fontSize: "1rem",
                background: V.white,
                color: V.black,
              }}
            >
              {theme}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
