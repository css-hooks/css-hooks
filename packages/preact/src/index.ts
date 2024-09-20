/**
 *  CSS Hooks for {@link https://preactjs.com | Preact}
 *
 * @packageDocumentation
 */

import { buildHooksSystem } from "@css-hooks/core";
import type { JSX } from "preact";

const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

/**
 * A {@link @css-hooks/core#CreateHooksFn} configured to use Preact's
 * `JSX.CSSProperties` type and logic for converting CSS values into strings.
 *
 * @public
 */
export const createHooks = buildHooksSystem<JSX.CSSProperties>(_stringifyValue);

/** @internal */
export function _stringifyValue(value: unknown, propertyName: string) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}${
        typeof propertyName === "string" &&
        IS_NON_DIMENSIONAL.test(propertyName)
          ? ""
          : "px"
      }`;
    default:
      return null;
  }
}
