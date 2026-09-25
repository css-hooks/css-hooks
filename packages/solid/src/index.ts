/**
 * CSS Hooks for {@link https://www.solidjs.com/ | Solid}
 *
 * @packageDocumentation
 */

import { createHooksSystem } from "@css-hooks/core";
import type { JSX } from "@solidjs/web";

import type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

export type * from "@css-hooks/core";
export type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

const hooksSystem = createHooksSystem<
  JSX.CSSProperties,
  CSSPropertyConflicts
>();

/**
 * A hook factory configured to use Solid's `JSX.CSSProperties` type and logic
 * for converting CSS values into strings
 *
 * @public
 */
export const createHooks = hooksSystem.createHooks;

/** A style merger configured to use Solid's `JSX.CSSProperties` type. @public */
export const mergeStyles = hooksSystem.mergeStyles;
