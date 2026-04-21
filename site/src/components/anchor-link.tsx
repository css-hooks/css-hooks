import type { ComponentProps } from "react";
import { pipe } from "remeda";

import { and, dark, intent, merge, on } from "../css.ts";
import { purple } from "../design/colors.ts";

export const anchorLinkStyle = pipe(
  {
    outlineWidth: 0,
    outlineOffset: 2,
    outlineStyle: "solid",
    outlineColor: purple(20),
    color: purple(55),
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationColor: purple(35),
    textUnderlineOffset: "3px",
  },
  on("&:has(*)", {
    display: "inline-flex",
  }),
  on(intent, {
    color: purple(61),
    textDecorationStyle: "solid",
  }),
  on("&:active", {
    color: purple(68),
  }),
  on(dark, {
    textDecorationColor: purple(55),
    outlineColor: purple(50),
    color: purple(35),
  }),
  on(and(dark, intent), {
    color: purple(29),
  }),
  on(and(dark, "&:active"), {
    color: purple(22),
  }),
  on("&:focus-visible", {
    outlineWidth: 2,
  }),
);

export function AnchorLink({ style, ...restProps }: ComponentProps<"a">) {
  return <a style={pipe(anchorLinkStyle, merge(style))} {...restProps} />;
}
