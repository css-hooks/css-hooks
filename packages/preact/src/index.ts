import type { JSX } from "preact";
import { createHooksFn, types } from "@hooks.css/core";

/**
 * @remarks
 * Sourced from
 * {@link https://github.com/preactjs/preact/blob/4fea40d1124ba631f8a11c27f6e71e018136318e/src/constants.js#L3-L4 | Preact}.
 */
const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

/**
 * @internal
 *
 * @remarks
 * This should align with
 * {@link https://github.com/preactjs/preact/blob/4fea40d1124ba631f8a11c27f6e71e018136318e/src/diff/props.js#L36-L46 | Preact's algorithm}.
 */
export function stringifyValue(
  propertyName: string,
  value: unknown,
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}${IS_NON_DIMENSIONAL.test(propertyName) ? "" : "px"}`;
  }

  return null;
}

export default createHooksFn<JSX.DOMCSSProperties>()(
  "camel",
  stringifyValue,
  types,
);
