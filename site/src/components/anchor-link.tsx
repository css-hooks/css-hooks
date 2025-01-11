import type { ComponentProps } from "react";
import { pipe } from "remeda";

import { and, dark, hover, merge, not, on } from "../css.ts";
import { blue, red } from "../design/colors.ts";

export const anchorLinkStyle = pipe(
  {
    outlineWidth: 0,
    outlineOffset: 2,
    outlineStyle: "solid",
    outlineColor: blue(20),
    color: blue(60),
  },
  on("&:has(*)", {
    display: "inline-flex",
  }),
  on(not(hover), {
    textDecoration: "none",
  }),
  on(hover, {
    color: blue(50),
  }),
  on("&:active", {
    color: red(50),
  }),
  on(dark, {
    outlineColor: blue(50),
    color: blue(30),
  }),
  on(and(dark, hover), {
    color: blue(20),
  }),
  on(and(dark, "&:active"), {
    color: red(20),
  }),
  on("&:focus-visible", {
    outlineWidth: 2,
  }),
);

export function AnchorLink({ style, ...restProps }: ComponentProps<"a">) {
  return <a style={pipe(anchorLinkStyle, merge(style))} {...restProps} />;
}
