/**
 * Easily configure an opinionated set of hooks
 *
 * @packageDocumentation
 */

/**
 * The format of the configuration object passed to the {@link recommended}
 * function
 *
 * @public
 */
export type RecommendedConfig = {
  /**
   * Color schemes used to configure `prefers-color-scheme` media query hooks
   *
   * @example
   * ```
   * recommended({
   *   colorSchemes: ["dark", "light"]
   * })
   *
   * // Returns
   * ({
   *   "@media (prefers-color-scheme: dark)": "@media (prefers-color-scheme: dark)",
   *   "@media (prefers-color-scheme: dark)": "@media (prefers-color-scheme: light)"
   * })
   * ```
   */
  colorSchemes?: ("dark" | "light")[];

  /**
   * Breakpoints used to configure `width` media query hooks. Must be specified
   * in ascending order.
   *
   * @example
   * ```
   * recommended({
   *   breakpoints: ["500px", "1000px"]`
   * })
   *
   * // Returns
   * ({
   *   "@media (width < 500px)": "@media (width < 500px)",
   *   "@media (500px <= width < 1000px)": "@media (500px <= width < 1000px)",
   *   "@media (1000px <= width)": "@media (1000px <= width)"
   * })
   * ```
   */
  breakpoints?: string[];

  /**
   * Pseudo-classes used to generate pseudo-class selector hooks
   *
   * @example
   * ```
   * recommended({
   *   pseudoClasses: [":hover", ":disabled", ":nth-child(odd)"]
   * })
   *
   * // Returns
   * ({
   *   "&:hover": "&:hover",
   *   "&:disabled": "&:disabled",
   *   "&:nth-child(odd)": "&:nth-child(odd)"
   * })
   * ```
   */
  pseudoClasses?: `:${string}`[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This utility type turns a union type into an intersection type.
 *
 * @public
 */
export type UnionToIntersection<T> = (
  T extends any ? (t: T) => any : never
) extends (t: infer U) => any
  ? U
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * This utility type converts a hook implementation to an entry.
 *
 * @remarks
 * Useful for hook names that match their implementation
 *
 * @public
 */
export type StringToHook<S> = S extends string ? Record<S, S> : never;

/**
 * This utility type helps convert a list of breakpoints into a list of media
 * queries.
 *
 * @public
 */
export type BreakpointsToMediaQueriesImpl<
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

/**
 * This utility type converts a list of breakpoints into a list of media
 * queries.
 *
 * @public
 */
export type BreakpointsToMediaQueries<Breakpoints extends string[]> =
  UnionToIntersection<
    BreakpointsToMediaQueriesImpl<Breakpoints>[number] extends infer Q
      ? StringToHook<Q>
      : never
  >;

/**
 * This type adds media queries to a hook configuration when breakpoints are
 * specified.
 *
 * @public
 */
export type WidthMediaQueries<C> = C extends { breakpoints: string[] }
  ? BreakpointsToMediaQueries<C["breakpoints"]>
  : object;

/**
 * This type adds media queries to a hook configuration when color schemes are
 * specified.
 *
 * @public
 */
export type ColorSchemeMediaQueries<C> = C extends {
  colorSchemes: (infer ColorScheme)[];
}
  ? UnionToIntersection<
      StringToHook<`@media (prefers-color-scheme: ${ColorScheme extends string
        ? ColorScheme
        : never})`>
    >
  : object;

/**
 * This type adds selectors to a hook configuration when pseudo-classes are
 * specified.
 *
 * @public
 */
export type PseudoClassSelectors<C> = C extends { pseudoClasses: string[] }
  ? C["pseudoClasses"] extends (infer PseudoClass)[]
    ? UnionToIntersection<
        StringToHook<`&${PseudoClass extends string ? PseudoClass : never}`>
      >
    : object
  : object;

/**
 * Based on your settings, produces a hook configuration with an opinionated set
 * of hooks to address the most common use cases.
 *
 * @param config - A simplified configuration model for an opinionated set of
 * hooks
 *
 * @returns
 * An advanced hook configuration that you can pass to the `createHooks`
 * function
 *
 * @remarks
 * Requires TypeScript version 5.3 or later.
 *
 * @public
 */
export function recommended<const C extends RecommendedConfig>(
  config: C & RecommendedConfig,
): WidthMediaQueries<C> & ColorSchemeMediaQueries<C> & PseudoClassSelectors<C>;
