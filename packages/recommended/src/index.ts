type RecommendedConfig = {
  /**
   * Color schemes used to configure `prefers-color-scheme` media query hooks
   *
   * @remarks
   *
   * Example value: `["dark", "light"]`
   *
   * Resulting hook names:
   * - `@media (prefers-color-scheme: dark)`
   * - `@media (prefers-color-scheme: light)`
   */
  colorSchemes?: ("dark" | "light")[];

  /**
   * Breakpoints used to configure `width` media query hooks
   *
   * @remarks
   *
   * These must be specified in ascending order.
   *
   * Example value: `["500px", "1000px"]`
   *
   * Resulting hook names:
   * - `@media (width < 500px)`
   * - `@media (500px <= width < 1000px)`
   * - `@media (1000px <= width)`
   */
  breakpoints?: string[];

  /**
   * Pseudo-classes used to generate pseudo-class selector hooks
   *
   * @remarks
   *
   * Example value: `[":hover", ":disabled", ":nth-child(odd)"]`
   *
   * Resulting hook names:
   * - `&:hover`
   * - `&:disabled`
   * - `&:nth-child(odd)`
   */
  pseudoClasses?: `:${string}`[];
};

type Display<T> = T extends never ? never : { [K in keyof T]: T[K] };

/* eslint-disable @typescript-eslint/no-explicit-any */
type UnionToIntersection<T> = (T extends any ? (t: T) => any : never) extends (
  t: infer U,
) => any
  ? U
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

type StringToHook<S> = S extends string ? Record<S, S> : never;

type BreakpointsToMediaQueriesImpl<
  Breakpoints,
  Acc extends string[] = [],
> = Breakpoints extends [infer A, infer B, ...infer Tail]
  ? Acc extends []
    ? BreakpointsToMediaQueriesImpl<
        [A, B, ...Tail],
        [...Acc, `@media (width < ${A extends string ? A : never})`]
      >
    : BreakpointsToMediaQueriesImpl<
        [B, ...Tail],
        [
          ...Acc,
          `@media (${A extends string ? A : never} <= width < ${B extends string
            ? B
            : never})`,
        ]
      >
  : Breakpoints extends [infer A]
  ? Acc extends []
    ? [
        `@media (width < ${A extends string ? A : never})`,
        `@media (${A extends string ? A : never} <= width)`,
      ]
    : [...Acc, `@media (${A extends string ? A : never} <= width)`]
  : Acc;

type BreakpointsToMediaQueries<Breakpoints extends string[]> =
  UnionToIntersection<
    BreakpointsToMediaQueriesImpl<Breakpoints>[number] extends infer Q
      ? StringToHook<Q>
      : never
  >;

type WithBreakpoints<C, I> = C extends { breakpoints: string[] }
  ? BreakpointsToMediaQueries<C["breakpoints"]> & I
  : I;

type WithColorSchemes<C, I> = C extends { colorSchemes: (infer ColorScheme)[] }
  ? UnionToIntersection<
      StringToHook<`@media (prefers-color-scheme: ${ColorScheme extends string
        ? ColorScheme
        : never})`>
    > &
      I
  : I;

type WithPseudoClasses<C, I> = C extends { pseudoClasses: string[] }
  ? C["pseudoClasses"] extends (infer PseudoClass)[]
    ? UnionToIntersection<
        StringToHook<`&${PseudoClass extends string ? PseudoClass : never}`>
      > &
        I
    : never
  : I;

type HookConfig<C extends RecommendedConfig> = Display<
  WithPseudoClasses<C, WithColorSchemes<C, WithBreakpoints<C, unknown>>>
>;

/**
 * Based on your settings, produces a hook configuration with an opinionated set
 * of hooks to address the most common use cases.
 *
 * @param config
 * A simplified configuration model for an opinionated set of hooks
 *
 * @returns
 * An advanced hook configuration that you can pass to the `createHooks` function
 *
 * @remarks
 * Requires TypeScript version 5.3 or later.
 */
export function recommended<const C extends RecommendedConfig>(
  config: C & RecommendedConfig,
): HookConfig<C> {
  type PartialHookConfig = HookConfig<C>;

  const colorSchemes = (config.colorSchemes || [])
    .map(x => `@media (prefers-color-scheme: ${x})`)
    .reduce((obj, x) => ({ ...obj, [x]: x }), {}) as PartialHookConfig;

  const breakpoints = (config.breakpoints
    ?.flatMap((x, i, arr) => {
      if (arr.length === 1) {
        return [`@media (width < ${x})`, `@media (${x} <= width)`];
      }
      if (i === 0) {
        return [`@media (width < ${x})`];
      }
      const previous = arr[i - 1];
      return [
        `@media (${previous} <= width < ${x})`,
        ...(i === arr.length - 1 ? [`@media (${x} <= width)`] : []),
      ];
    })
    .reduce((obj, x) => ({ ...obj, [x]: x }), {}) || {}) as PartialHookConfig;

  const pseudoClasses = (config.pseudoClasses?.reduce(
    (obj, x) => ({ ...obj, [`&${x}`]: `&${x}` }),
    {},
  ) || {}) as PartialHookConfig;

  return {
    ...colorSchemes,
    ...breakpoints,
    ...pseudoClasses,
  };
}
