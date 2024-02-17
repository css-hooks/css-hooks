import { component$ } from "@builder.io/qwik";
import * as V from "varsace";
import { css } from "~/css";
import * as Theme from "~/theme";
import * as Icon from "~/components/icons";

export const ThemeSwitcher = component$(() => (
  <div
    style={css({
      position: "relative",
      display: "inline-flex",
      outlineWidth: 0,
      outlineStyle: "solid",
      outlineColor: V.blue20,
      outlineOffset: 2,
      match: (on, { all }) => [
        on("&:focus-visible-within", {
          outlineWidth: 2,
        }),
        on("&:hover", {
          color: V.blue40,
        }),
        on("&:active", {
          color: V.red40,
        }),
        on("@media (prefers-color-scheme: dark)", {
          outlineColor: V.blue50,
          color: V.blue30,
        }),
        on(all("@media (prefers-color-scheme: dark)", "&:hover"), {
          color: V.blue20,
        }),
        on(all("@media (prefers-color-scheme: dark)", "&:active"), {
          color: V.red20,
        }),
      ],
    })}
  >
    <div style={css({ display: "inline-flex", fontSize: "1.125rem" })}>
      <div
        style={css({
          display: "none",
          match: on => [
            on("@media (prefers-color-scheme: dark)", {
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
          match: (on, { not }) => [
            on(not("@media (prefers-color-scheme: dark)"), {
              display: "contents",
            }),
          ],
        })}
      >
        <Icon.LightMode />
      </div>
      <Icon.ArrowDropDown />
    </div>
    <select
      id={Theme.switcherId}
      style={css({ position: "absolute", inset: 0, opacity: 0 })}
    >
      {Theme.options.map(theme => (
        <option
          key={theme}
          selected={theme === Theme.defaultOption}
          style={css({ background: V.white, color: V.black })}
        >
          {theme}
        </option>
      ))}
    </select>
  </div>
));
