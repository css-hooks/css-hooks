import type { CSSProperties } from "react";
import { WithHooks, createHooksFn, types } from "@hooks.css/core";
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

const casing = "camel" as const;

const hooks: (
  propertiesWithHooks: WithHooks<CSSProperties, typeof types>,
) => CSSProperties = createHooksFn<typeof casing, typeof types, CSSProperties>(
  "camel",
  types,
  stringifyValue,
);

export default hooks;
