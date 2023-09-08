import type { CSSProperties } from "react";
import { buildHooksSystem, recommended } from "@css-hooks/core";
import unitless from "@emotion/unitless";

/**
 * @internal
 *
 * @remarks
 * Theoretically this should line up with the behavior of
 * {@link https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/client/CSSPropertyOperations.js}.
 */
export function stringifyValue(
  propertyName: string,
  value: unknown,
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}${!(propertyName in unitless) ? "px" : ""}`;
  }

  return null;
}

/**
 * Creates the hooks specified in the configuration.
 *
 * @param config - The hooks to build
 *
 * @returns The CSS required to enable the configured hooks, along with the corresponding `hooks` function for use in components.
 */
export const createHooks = buildHooksSystem<CSSProperties>(stringifyValue);

export { recommended };
