/**
 * CSS Hooks for {@link https://preactjs.com | Preact}
 *
 * @packageDocumentation
 */

import type { HooksSystem } from "@css-hooks/core";
import { createHooksSystem } from "@css-hooks/core";
import type { CSSProperties } from "preact";

import type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

export type * from "@css-hooks/core";
export type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

/**
 * See
 * https://github.com/preactjs/preact/blob/bc4e5bc536ddcafdca27e68b3339521ce0d34f00/compat/src/util.js#L15-L16
 */
const IS_NON_DIMENSIONAL =
  /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini|asp|fill|st)/;

/** Additional cases not covered by Preact's IS_NON_DIMENSIONAL pattern */
const IS_NON_DIMENSIONAL_EXTRA =
  /^(?:hyphenateLimitChars|mathDepth|readingOrder|Webkit(?:Animation|BorderImage|BoxOrdinalGroup|Columns|MaskBoxImage(?:Outset|Slice|Width)?|Order))$/;

const hooksSystem = createHooksSystem<CSSProperties, CSSPropertyConflicts>(
  _stringifyValue,
);

/**
 * A hook factory configured to use Preact’s `CSSProperties` type and logic for
 * converting CSS values into strings
 *
 * @public
 */
export const createHooks = hooksSystem.createHooks;

/** A style merger configured to use Preact’s `CSSProperties` type. @public */
export const mergeStyles: HooksSystem<
  CSSProperties,
  CSSPropertyConflicts
>["mergeStyles"] = hooksSystem.mergeStyles;

/** @internal */
export function _stringifyValue(value: unknown, propertyName: string) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}${propertyName.startsWith("--") || IS_NON_DIMENSIONAL.test(propertyName) || IS_NON_DIMENSIONAL_EXTRA.test(propertyName) ? "" : "px"}`;
    default:
      return null;
  }
}
