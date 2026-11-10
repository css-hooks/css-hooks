import { createHooksSystem } from "@css-hooks/core";
import type { PropertiesHyphen } from "csstype";

const { createHooks, mergeStyles } =
  createHooksSystem<PropertiesHyphen<string>>();

export const { on, styleSheet } = createHooks("&:hover");

/** Converts a style object to a string. */
export function styleObjectToString(style: PropertiesHyphen<string>) {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");
}

export { mergeStyles };
