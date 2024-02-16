import { CSSProperties, Slot, component$ } from "@builder.io/qwik";
import * as V from "varsace";
import { css } from "~/css";

type AnchorProps = { href?: string; style?: CSSProperties; selected?: boolean };

export const anchorStyle = css({
  outlineWidth: 0,
  outlineOffset: 2,
  outlineStyle: "solid",
  outlineColor: V.blue20,
  color: V.blue50,
  match: (on, { all, not }) => [
    on(not("&:hover"), {
      textDecoration: "none",
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
    on("&:focus-visible", {
      outlineWidth: 2,
    }),
    on("&.selected", {
      color: "inherit",
    }),
  ],
});

export const Anchor = component$(({ href, selected, style }: AnchorProps) => (
  <a
    href={href}
    style={css(anchorStyle, style)}
    class={selected ? "selected" : ""}
  >
    <Slot />
  </a>
));
