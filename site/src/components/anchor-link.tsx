import type { ComponentProps } from "react";
import { pipe } from "remeda";
import * as V from "varsace";

import { and, dark, hover, merge, not, on } from "../css.ts";

export const anchorLinkStyle = pipe(
  {
    outlineWidth: 0,
    outlineOffset: 2,
    outlineStyle: "solid",
    outlineColor: V.blue20,
    color: V.blue50,
  },
  on("&:has(*)", {
    display: "inline-flex",
  }),
  on(not(hover), {
    textDecoration: "none",
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
  on("&:focus-visible", {
    outlineWidth: 2,
  }),
);

export function AnchorLink({ style, ...restProps }: ComponentProps<"a">) {
  return <a style={pipe(anchorLinkStyle, merge(style))} {...restProps} />;
}
