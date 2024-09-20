/**
 *  CSS Hooks for {@link https://www.solidjs.com/ | Solid}
 *
 * @packageDocumentation
 */

import { buildHooksSystem } from "@css-hooks/core";
import type { JSX } from "solid-js";

/**
 * A {@link @css-hooks/core#CreateHooksFn} configured to use Solid's
 * `JSX.CSSProperties` type and logic for converting CSS values into strings.
 *
 * @public
 */
export const createHooks = buildHooksSystem<JSX.CSSProperties>();
