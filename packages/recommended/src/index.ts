type Config = {
  colorSchemes?: ("dark" | "light")[];
  breakpoints?: string[];
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

type HooksConfig<C extends Config> = Display<
  WithPseudoClasses<
    C,
    WithColorSchemes<C, WithBreakpoints<C, unknown>> extends infer O
      ? unknown extends O
        ? Record<string, never>
        : O
      : never
  >
>;

/**
 * Based on your selections, produces a hook configuration with a default set of
 * hooks to address the most common use cases.
 *
 * @param config
 * Use these settings to control which hooks to generate and their specific
 * details (e.g. media query breakpoints).
 *
 * @returns
 * The CSS Hooks configuration that you can pass to the `createHooks` function
 *
 * @remarks
 * Requires TypeScript version 5.3 or later.
 */
export function recommended<const C extends Config>(config: C): HooksConfig<C> {
  type PartialHooksConfig = HooksConfig<C>;

  const colorSchemes = (config.colorSchemes || [])
    .map(x => `@media (prefers-color-scheme: ${x})`)
    .reduce((obj, x) => ({ ...obj, [x]: x }), {}) as PartialHooksConfig;

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
    .reduce((obj, x) => ({ ...obj, [x]: x }), {}) || {}) as PartialHooksConfig;

  const pseudoClasses = (config.pseudoClasses?.reduce(
    (obj, x) => ({ ...obj, [`&${x}`]: `&${x}` }),
    {},
  ) || {}) as PartialHooksConfig;

  return {
    ...colorSchemes,
    ...breakpoints,
    ...pseudoClasses,
  };
}
