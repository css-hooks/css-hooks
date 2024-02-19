/**
 *  CSS Hooks for {@link https://preactjs.com | Preact}
 *
 * @packageDocumentation
 */

import type { JSX } from "preact";
import type { CreateHooksFn } from "@css-hooks/core";

/**
 * A version of Preact's `JSX.CSSProperties` type that admits an `on` field
 *
 * @public
 */
export type CSSProperties = JSX.DOMCSSProperties & { cssText?: string | null };

/**
 * A {@link @css-hooks/core#CreateHooksFn} configured to use Preact's
 * `JSX.CSSProperties` type and logic for converting CSS values into strings.
 *
 * @public
 */
export const createHooks: CreateHooksFn<CSSProperties>;

/** @internal */
declare function _stringifyValue(
  propertyName: string,
  value: unknown,
): string | null;
