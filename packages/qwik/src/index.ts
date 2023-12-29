import type { CSSProperties } from "@builder.io/qwik";
import { buildHooksSystem } from "@css-hooks/core";
import isUnitlessNumber from "./isUnitlessNumber.js";

/**
 * @internal
 *
 * @remarks
 * Theoretically this should line up with the behavior of
 * {@link https://github.com/BuilderIO/qwik/blob/1c6ccf935b3b7f2dc175b90b0503ae6936ba25ff/packages/qwik/src/core/render/execute-component.ts#L155-L187}.
 */
export function stringifyValue(
  propertyName: string,
  value: unknown,
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}${isUnitlessNumber(propertyName) ? "" : "px"}`;
  }

  return null;
}

/**
 * Creates the hooks specified in the configuration.
 *
 * @param config - The hooks to build
 *
 * @returns The `hooks` CSS required to enable the configured hooks, along with the corresponding `css` function for use in components.
 */
export const createHooks = buildHooksSystem<CSSProperties>(stringifyValue);
