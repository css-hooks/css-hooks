import { createHooks } from "@css-hooks/react";
import type { CSSProperties } from "react";

export const { styleSheet, on, and, or, not } = createHooks(
  "@supports (height: 100dvh)",

  "@media (width < 28em)",
  "@media (width < 44em)",
  "@media (width < 69em)",
  "@media (width >= 28em)",
  "@media (width >= 44em)",
  "@media (width >= 69em)",
  "@media (prefers-color-scheme: dark)",
  "@media (hover: hover)",

  "[data-theme='auto'] &",
  "[data-theme='dark'] &",

  "@container (width < 50px)",
  "@container (width < 100px)",
  "@container (width >= 100px)",

  "&:active",
  "&:empty",
  "&:focus-visible",
  "&:has(*)",
  "&:has(:focus-visible)",
  "&:focus",
  "&:hover",
  "&:only-child",

  ".group &.group",
  ".group:hover &",
  ".group:nth-child(even) &",
  ":checked + &",
  ":focus + &",
  ":hover + &",
  "&.primary",
  ".blue &",
  ".pink &",
  ".yellow &",
  ".green &",
  ".teal &",
  ".purple &",
  ".prose &",
  ".section &",
  "&.selected",
  ":has(:checked) + &",
  ".shiki > &",
  "td > &:only-child",
  "th > &:only-child",
);

export const dark = or(
  "[data-theme='dark'] &",
  and("[data-theme='auto'] &", "@media (prefers-color-scheme: dark)"),
);

export const hover = and("&:hover", "@media (hover: hover)");

export const intent = or(hover, "&:focus");

export const intentAdjacentSibling = or(
  and(":hover + &", "@media (hover: hover)"),
  ":focus + &",
);

export function merge(b: CSSProperties | undefined) {
  return (a: CSSProperties) => {
    if (!b) {
      return a;
    }
    const style = JSON.parse(JSON.stringify(a)) as CSSProperties;
    for (const key in b) {
      const property = key as keyof CSSProperties;
      delete style[property];
      Object.assign(style, { [property]: b[property] });
    }
    return style;
  };
}
