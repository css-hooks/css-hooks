import type { JSX } from "solid-js";
import {
  buildHooksSystem,
  recommended as coreRecommended,
  genericStringify,
} from "@css-hooks/core";
import { A, U } from "ts-toolbelt";

/** @internal */
export const stringifyValue = genericStringify;

/**
 * Creates the hooks specified in the configuration.
 *
 * @param config - The hooks to build
 *
 * @returns The `hooks` CSS required to enable the configured hooks, along with the corresponding `css` function for use in components.
 */
export const createHooks = buildHooksSystem<JSX.CSSProperties>(stringifyValue);

type CamelToKebab<
  S extends string,
  Acc extends string = "",
> = S extends `${infer H}${infer T}`
  ? CamelToKebab<T, `${Acc}${H extends Capitalize<H> ? `-${Lowercase<H>}` : H}`>
  : Acc;

function keybab<R extends Record<string, unknown>, K extends keyof R = keyof R>(
  r: R,
): A.Compute<
  U.IntersectOf<K extends string ? Record<CamelToKebab<K>, R[K]> : never>
> {
  /* eslint-disable @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any */
  return Object.fromEntries(
    Object.entries(r).map(([key, value]) => [
      key.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`),
      value,
    ]),
  ) as any;
  /* eslint-enable @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any */
}

/**
 * A list of hooks offered as a "sensible default" to solve the most common use cases.
 *
 * @deprecated Use the `@css-hooks/recommended` package instead.
 */
export const recommended = keybab(coreRecommended);
