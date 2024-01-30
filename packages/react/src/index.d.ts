/**
 *  CSS Hooks for {@link https://react.dev | React}
 *
 * @packageDocumentation
 */

import type { CSSProperties } from "react";
import { CreateHooksFn } from "@css-hooks/core";

/**
 * A {@link @css-hooks/core#CreateHooksFn} configured to use React's
 * `CSSProperties` type and logic for converting CSS values into strings.
 *
 * @public
 */
export const createHooks: CreateHooksFn<CSSProperties>;

/** @internal */
declare function _stringifyValue(
  propertyName: string,
  value: unknown,
): string | null;

/** @internal */
export const _unitlessNumbers: Set<string>;
