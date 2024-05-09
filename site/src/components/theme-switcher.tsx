import * as V from "varsace";
import { css } from "../css.js";
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
      style={css({
        position: "relative",
        display: "inline-flex",
        outlineWidth: 0,
        outlineStyle: "solid",
        outlineColor: V.blue20,
        outlineOffset: 2,
        color: V.blue50,
        on: ($, { and }) => [
          $("&:focus-visible-within", {
            outlineWidth: 2,
          }),
          $("&:hover", {
            color: V.blue40,
          }),
          $("&:active", {
            color: V.red40,
          }),
          $("@media (prefers-color-scheme: dark)", {
            outlineColor: V.blue50,
            color: V.blue30,
          }),
          $(and("@media (prefers-color-scheme: dark)", "&:hover"), {
            color: V.blue20,
          }),
          $(and("@media (prefers-color-scheme: dark)", "&:active"), {
            color: V.red20,
          }),
        ],
      })}
    >
      <div style={css({ display: "inline-flex" })}>
        <div
          style={css({
            display: "none",
            on: $ => [
              $("@media (prefers-color-scheme: dark)", {
                display: "contents",
              }),
            ],
          })}
        >
          <Icon.DarkMode />
        </div>
        <div
          style={css({
            display: "none",
            on: ($, { not }) => [
              $(not("@media (prefers-color-scheme: dark)"), {
                display: "contents",
              }),
            ],
          })}
        >
          <Icon.LightMode />
        </div>
        <Icon.ArrowDropDown />
      </div>
      <label>
        <ScreenReaderOnly>Theme</ScreenReaderOnly>
        <select
          id={switcherId}
          style={css({
            fontSize: 0,
            position: "absolute",
            inset: 0,
            opacity: 0,
          })}
        >
          {themes.map(theme => (
            <option
              selected={theme === defaultTheme}
              style={css({
                fontSize: "1rem",
                background: V.white,
                color: V.black,
              })}
            >
              {theme}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
