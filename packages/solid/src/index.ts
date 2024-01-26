import type { JSX } from "solid-js";
import { buildHooksSystem } from "@css-hooks/core";

/**
 * Creates the hooks specified in the configuration.
 *
 * @param config - The hooks to build
 *
 * @returns The `hooks` CSS required to enable the configured hooks, along with the corresponding `css` function for use in components.
 */
export const createHooks = buildHooksSystem<JSX.CSSProperties>();
