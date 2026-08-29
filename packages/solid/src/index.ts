/**
 * CSS Hooks for {@link https://www.solidjs.com/ | Solid}
 *
 * @packageDocumentation
 */

import type { CreateHooksFn } from "@css-hooks/core";
import { buildHooksSystem } from "@css-hooks/core";
import type { JSX } from "solid-js";

import type { CSSPropertyConflicts } from "./css-property-conflicts.ts";

export type * from "@css-hooks/core";

/**
 * A {@link @css-hooks/core#CreateHooksFn} configured to use Solid's
 * `JSX.CSSProperties` type and logic for converting CSS values into strings
 *
 * @public
 */
export const createHooks: CreateHooksFn<
  JSX.CSSProperties,
  CSSPropertyConflicts
> = buildHooksSystem<JSX.CSSProperties, CSSPropertyConflicts>();
