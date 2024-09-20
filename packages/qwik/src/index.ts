/**
 *  CSS Hooks for {@link https://qwik.dev | Qwik}
 *
 * @packageDocumentation
 */

import type { CSSProperties } from "@builder.io/qwik";
import { buildHooksSystem } from "@css-hooks/core";

/** @internal */
export function _stringifyValue(value: unknown, propertyName: string) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}${isUnitlessNumber(propertyName) ? "" : "px"}`;
    default:
      return null;
  }
}

/**
 * A {@link @css-hooks/core#CreateHooksFn} configured to use Qwik's
 * `CSSProperties` type and logic for converting CSS values into strings.
 *
 * @public
 */
export const createHooks = buildHooksSystem<CSSProperties>(_stringifyValue);

/**
 * Following code (c) Builder.io.
 * Source modified to account for custom properties.
 */

/**
 * CSS properties which accept numbers but are not in units of "px".
 *
 * @internal
 */
export const _unitlessNumbers = new Set([
  "animationIterationCount",
  "aspectRatio",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "columns",
  "flex",
  "flexGrow",
  "flexShrink",
  "gridArea",
  "gridRow",
  "gridRowEnd",
  "gridRowStart",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnStart",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "scale",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "MozAnimationIterationCount", // Known Prefixed Properties
  "MozBoxFlex", // TODO: Remove these since they shouldn't be used in modern code
  "msFlex",
  "msFlexPositive",
  "WebkitAnimationIterationCount",
  "WebkitBoxFlex",
  "WebkitBoxOrdinalGroup",
  "WebkitColumnCount",
  "WebkitColumns",
  "WebkitFlex",
  "WebkitFlexGrow",
  "WebkitFlexShrink",
  "WebkitLineClamp",
]);

function isUnitlessNumber(name: string) {
  return /^--/.test(name) || _unitlessNumbers.has(name);
}
