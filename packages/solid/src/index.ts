import type { JSX } from "solid-js";
import { WithHooks, createHooksFn, types } from "@hooks.css/core";

/** @internal */
export function stringifyValue(_: string, value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return null;
}

const casing = "kebab" as const;

const hooks: (
  propertiesWithHooks: WithHooks<JSX.CSSProperties, typeof types>,
) => JSX.CSSProperties = createHooksFn<
  typeof casing,
  typeof types,
  JSX.CSSProperties
>("kebab", types, stringifyValue);

export default hooks;
