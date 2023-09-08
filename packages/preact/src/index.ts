import type { JSX } from "preact";
import { buildHooksSystem, recommended } from "@css-hooks/core";

/**
 * @internal
 *
 * @remarks
 * The type we really want is {@link JSX.CSSProperties}. However, that type
 * enforces a flat structure that is incompatible with hooks.
 */
export type CSSProperties = JSX.DOMCSSProperties & { cssText?: string | null };

/**
 * @remarks
 * Sourced from
 * {@link https://github.com/preactjs/preact/blob/4fea40d1124ba631f8a11c27f6e71e018136318e/src/constants.js#L3-L4 | Preact}.
 */
const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

/**
 * @internal
 *
 * @remarks
 * This should align with
 * {@link https://github.com/preactjs/preact/blob/4fea40d1124ba631f8a11c27f6e71e018136318e/src/diff/props.js#L36-L46 | Preact's algorithm}.
 */
export function stringifyValue(
  propertyName: string | number | symbol,
  value: unknown,
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}${
      typeof propertyName === "string" && IS_NON_DIMENSIONAL.test(propertyName)
        ? ""
        : "px"
    }`;
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
