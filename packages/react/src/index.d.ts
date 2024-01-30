import type { CSSProperties } from "react";
import { CreateHooksFn } from "@css-hooks/core";

export const createHooks: CreateHooksFn<CSSProperties>;

/** @internal */
declare function stringifyValue(
  propertyName: string,
  value: unknown,
): string | null;

/** @internal */
export const unitlessNumbers: Set<string>;
