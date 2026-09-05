import { createHooks } from "@css-hooks/react";
import type { CSSProperties } from "react";

export const { styleSheet, on, and, or, not } = createHooks(
  "@supports (height: 100dvh)",

  "@media (width >= 44em)",
  "@media (width >= 69em)",
  "@media (prefers-color-scheme: dark)",
  "@media (hover: hover)",

  "[data-theme='auto'] &",
  "[data-theme='dark'] &",

  "@container (width < 50px)",
  "@container (width < 100px)",
  "@container (width >= 64ch)",
  "@container (width >= 112ch)",
  "@container (width >= 100px)",

  "&:active",
  "&:focus-visible",
  "&:first-child",
  "&:has(*)",
  "&:has(:focus)",
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

  "&.a",
  "&.b",
  "&.c",

  "&:has(.a)",
  "&:has(.b)",

  ":has(:checked) + &",
  "td > &:only-child",
  "th > &:only-child",
);

export const dark = or(
  "[data-theme='dark'] &",
  and("[data-theme='auto'] &", "@media (prefers-color-scheme: dark)"),
);

export const light = not(dark);

export const hover = and("&:hover", "@media (hover: hover)");

export const intent = or(hover, "&:focus", "&:has(:focus)");

export const intentAdjacentSibling = or(
  and(":hover + &", "@media (hover: hover)"),
  ":focus + &",
);

export function stringifyStyle(style: CSSProperties): string {
  return Object.entries(style)
    .map(([property, value]) => {
      const kebab = property.startsWith("--")
        ? property
        : property.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
      return `${kebab}: ${value}`;
    })
    .join("; ");
}

export function parseStyle(cssText: string): CSSProperties {
  const style: Record<string, string> = {};
  for (const declaration of cssText.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon === -1) continue;
    const property = declaration.slice(0, colon).trim();
    const value = declaration.slice(colon + 1).trim();
    if (!property || !value) continue;
    const camel = property.startsWith("--")
      ? property
      : property.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    style[camel] = value;
  }
  return style as CSSProperties;
}

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

type ExtractClassName<Selector extends string> =
  Selector extends `${infer Head}${infer Tail}`
    ? Head extends "."
      ? Tail
      : ExtractClassName<Tail>
    : never;
export function extractClassName<Selector extends string>(
  selector: Selector,
): ExtractClassName<Selector> {
  const [_, s] = selector.split(".");
  return s as ExtractClassName<Selector>;
}

export function withAlpha(color: string, opacity: number): string {
  return `color-mix(in oklch, ${color} ${opacity * 100}%, transparent)`;
}
