import { Slot, component$ } from "@builder.io/qwik";
import * as V from "varsace";
import { css } from "~/css";

type AnchorProps = {
  href?: string;
  style?: Parameters<typeof css>[1];
  selected?: boolean;
};

export const anchorStyle = (style?: Parameters<typeof css>[1]) =>
  css(
    {
      outlineWidth: 0,
      outlineOffset: 2,
      outlineStyle: "solid",
      outlineColor: V.blue20,
      color: V.blue50,
      on: ($, { and, not }) => [
        $(not("&:hover"), {
          textDecoration: "none",
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
        $("&:focus-visible", {
          outlineWidth: 2,
        }),
        $("&.selected", {
          color: "inherit",
        }),
      ],
    },
    style,
  );

export const Anchor = component$(({ href, selected, style }: AnchorProps) => (
  <a href={href} style={anchorStyle(style)} class={selected ? "selected" : ""}>
    <Slot />
  </a>
));
