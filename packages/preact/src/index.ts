/**
 * CSS Hooks for {@link https://preactjs.com | Preact}
 *
 * @packageDocumentation
 */

import type { CreateHooksFn } from "@css-hooks/core";
import { buildHooksSystem } from "@css-hooks/core";
import type { CSSProperties } from "preact";

import type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

export type * from "@css-hooks/core";
export type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

/**
 * A {@link @css-hooks/core#CreateHooksFn} configured to use Preact's
 * `CSSProperties` type and logic for converting CSS values into strings
 *
 * @public
 */
export const createHooks: CreateHooksFn<CSSProperties, CSSPropertyConflicts> =
  buildHooksSystem<CSSProperties, CSSPropertyConflicts>(_stringifyValue);

/** @internal */
export function _stringifyValue(value: unknown, _propertyName: string) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return String(value);
    default:
      return null;
  }
}
