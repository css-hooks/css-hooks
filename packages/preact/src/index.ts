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

/** Unitless properties observed in Chromium, Firefox, and WebKit */
const UNITLESS =
  /^(--|(Moz(ForceBrokenImageIcon|TabSize)|lineHeight|tabSize|font(SizeAdjus|Weigh)t|widows|scale|(s|WebkitS)hapeImageThreshold|((border|WebkitMaskBox)Image|maskBorder)(Outset|Slice|Width)?|(Moz|Webkit)Bo(rderImage|x(Flex|OrdinalGroup))|stroke(Dash(array|offset)|Miterlimit|Width)|mathDepth|hyphenateLimit(Char|Line)s|readingOrder|Webkit(BoxFlexGroup|HyphenateLimit(After|Before|Lines)|LineClamp|Perspective)|aspectRatio|(i|WebkitI)nitialLetter|flexLineCount|(a|(Moz|Webkit)A)nimation(IterationCount)?|(c|WebkitC)olumn(s|Count)|(f|WebkitF)lex(Grow|Shrink)?|(o|WebkitO)(pacity|rder)|grid(Area|(Column|Row)(End|Start)?)|(fill|flood|stop|stroke)Opacity|orphans|z(Index|oom))$)/;

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
  if (typeof value === "number") {
    return value + (isUnitlessNumber(propertyName) ? "" : "px");
  }
  return typeof value === "string" ? value : null;
}

function isUnitlessNumber(name: string) {
  if (name.startsWith("--")) {
    return true;
  }
  const camelCaseName = name
    .replace(/^-ms-/, "ms-")
    .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
  return UNITLESS.test(camelCaseName);
}
