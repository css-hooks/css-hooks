import type { CSSProperties } from "react";
import { createHooksFn, types } from "@hooks.css/core";
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
  //

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}${!(propertyName in unitless) ? "px" : ""}`;
  }

  return null;
}

export default createHooksFn<CSSProperties>()("camel", stringifyValue, types);
