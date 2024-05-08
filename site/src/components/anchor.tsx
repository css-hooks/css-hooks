import * as V from "varsace";
import { css } from "../css.js";
import { JSXChildren } from "hastx/jsx-runtime";

export const anchorStyle = css({
  outlineWidth: 0,
  outlineOffset: 2,
  outlineStyle: "solid",
  outlineColor: V.blue20,
  color: V.blue50,
  on: ($, { and, not }) => [
    $("&:has(*)", {
      display: "inline-flex",
    }),
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
});

export function Anchor({
  children,
  href,
  selected,
}: {
  children: JSXChildren;
  href?: string;
  selected?: boolean;
}) {
  return (
    <a href={href} style={anchorStyle} class={selected ? "selected" : ""}>
      {children}
    </a>
  );
}
