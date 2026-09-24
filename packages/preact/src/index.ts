/**
 * CSS Hooks for {@link https://preactjs.com | Preact}
 *
 * @packageDocumentation
 */

import { buildHooksSystem } from "@css-hooks/core";
import type { CSSProperties } from "preact";

import type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

export type * from "@css-hooks/core";
export type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

const hooksSystem = buildHooksSystem<CSSProperties, CSSPropertyConflicts>(
  _stringifyValue,
);

/**
 * A hook factory configured to use Preact's `CSSProperties` type and logic for
 * converting CSS values into strings
 *
 * @public
 */
export const createHooks = hooksSystem.createHooks;

/** A style merger configured to use Preact's `CSSProperties` type. @public */
export const mergeStyles = hooksSystem.mergeStyles;

/** @internal */
export function _stringifyValue(value: unknown, propertyName: string) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}${propertyName.startsWith("--") || IS_NON_DIMENSIONAL.test(propertyName) ? "" : "px"}`;
    default:
      return null;
  }
}
