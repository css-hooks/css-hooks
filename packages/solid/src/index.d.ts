/**
 *  CSS Hooks for Solid
 *
 * @packageDocumentation
 */

import type { JSX } from "solid-js";
import type { CreateHooksFn } from "@css-hooks/core";

/**
 * A {@link @css-hooks/core#CreateHooksFn} configured to use Solid's
 * `JSX.CSSProperties` type and logic for converting CSS values into strings.
 *
 * @public
 */
export const createHooks: CreateHooksFn<JSX.CSSProperties>;
