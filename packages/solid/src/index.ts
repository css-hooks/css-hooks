import type { JSX } from "solid-js";
import { createHooksFn, types } from "@hooks.css/core";

/** @internal */
export function stringifyValue(_: string, value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return null;
}

export default createHooksFn<JSX.CSSProperties>()(
  "kebab",
  stringifyValue,
  types,
);
