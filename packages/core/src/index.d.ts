/**
 * Represents the conditions under which a given hook or declaration applies.
 *
 * @typeParam S - The basic type of condition to enhance with boolean
 * operations.
 */
export type Condition<S> =
  | S
  | { any: Condition<S>[] }
  | { all: Condition<S>[] }
  | { not: Condition<S> };

/**
 * Function to convert a value into a string.
 *
 * @remarks
 * Used for merging an override property value with the default/fallback value.
 *
 * @returns The stringified value or `null` if the value can't be stringified.
 */
export type StringifyFn = (
  /**
   * The property name corresponding to the value being stringified.
   *
   * @remarks
   * For example, React uses this to determine whether to apply a `px` suffix to
   * a number value. (e.g., `width` needs to specify the `px` unit, while
   * `z-index` does not.)
   */
  propertyName: string,

  /**
   * The value to stringify.
   */
  value: unknown,
) => string | null;

/**
 * Callback to construct a conditional style group.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @param condition - The condition under which the styles apply.
 *
 * @param styles - The styles that apply when the specified condition is met.
 *
 * @returns A list of style objects and the condition under which each one
 * applies.
 */
export type MatchOnFn<HookName, CSSProperties> = (
  condition: Condition<HookName>,
  style: CSSProperties,
) => [Condition<HookName>, CSSProperties];

/**
 * Helper functions used to construct advanced conditions.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 */
export interface MatchHelpers<HookName> {
  /**
   * Creates a condition that is true when all of the conditions passed as
   * arguments are true.
   */
  all(...conditions: Condition<HookName>[]): Condition<HookName>;

  /**
   * Creates a condition that is true when any of the conditions passed as
   * arguments is true.
   */
  any(...conditions: Condition<HookName>[]): Condition<HookName>;

  /**
   * Creates a condition that is true when the specified condition is false.
   */
  not(condition: Condition<HookName>): Condition<HookName>;
}

/**
 * Provides a way to declare conditional styles within a {@link Rule}.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @returns A list of the conditional styles declared.
 */
export type MatchFn<HookName, CSSProperties> = (
  /**
   * The callback used to construct a conditional style group.
   */
  on: MatchOnFn<HookName, CSSProperties>,

  /**
   * Helper functions used to construct advanced conditions.
   */
  helpers: MatchHelpers<HookName>,
) => [Condition<HookName>, CSSProperties][];

/**
 * Represents a style object, optionally enhanced with inline styles.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 */
export type Rule<HookName, CSSProperties> = CSSProperties & {
  /**
   * Conditional styles, where the second item in each entry represents the
   * declarations, and the first item expresses the condition under which those
   * declarations apply.
   *
   * @remarks
   * Think of this structure like a record. (Consider the return value of
   * `Object.entries({ ... })`.) However, because a normal record can't
   * represent advanced conditions, it's necessary to model conditional styles
   * as an array of tuples.
   */
  match?: MatchFn<HookName, CSSProperties>;
};

/**
 * This type exists to highlight the experimental nature of the type.
 *
 * @typeParam T - The experimental type.
 *
 * @experimental
 */
export type Experimental<T> = T;

/**
 * Represents the type of the `css` function, used to transform a {@link Rule}
 * into a flat style object.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @returns A flat style object, with dynamic values derived from the
 * conditional styles specified.
 */
export type CssFn<HookName, CSSProperties> = (
  /**
   * A style object, optionally enhanced with conditional styles.
   */
  style: Rule<HookName, CSSProperties>,

  /**
   * A list of style objects, each optionally enhanced with conditional styles.
   */
  ...styles: Experimental<(Rule<HookName, CSSProperties> | undefined)[]>
) => CSSProperties;

/**
 * Represents a basic hook implementation, using CSS syntax to define a selector or
 * at-rule.
 *
 * @remarks
 * Two types are supported:
 * 1. A selector, where `&` is used as a placeholder for the element to which
 *    the condition applies. The `&` character must appear somewhere.
 * 2. A `@media`, `@container`, or `@supports` at-rule. The value must begin
 *    with one of these keywords, followed by a space.
 *
 * These can be combined using the {@link Condition} structure to form complex logic.
 */
export type HookImpl =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`;

/**
 * Represents the configuration used to set up hooks.
 *
 * @typeParam Hooks - the hooks configured for use in conditional styles.
 */
export interface Config<Hooks> {
  /**
   * The hooks available for use in conditional styles.
   */
  hooks: Hooks;

  /**
   * The fallback keyword to use when no other value is available. The
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/revert-layer | `revert-layer`}
   * keyword is functionally the best option, but
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/unset | `unset`}
   * has better compatibility.
   *
   * @defaultValue "revert-layer"
   *
   * @remarks
   * Compatibility data are available from
   * {@link https://wpt.fyi/results/css/css-cascade?label=master&label=stable&product=chrome-99.0.4844.84&product=edge-99.0.1150.55&product=firefox-97.0.2&product=safari-16.4%20%2818615.1.26.110.1%29&q=revert-layer | Web Platform Tests}.
   */
  fallback?: "revert-layer" | "unset";

  /**
   * Whether to enable debug mode.
   *
   * @remarks
   * When debug mode is enabled:
   * 1. Hook identifiers (underlying CSS variables) are tagged with user-defined
   *    hook names.
   * 2. Extra whitespace is included in the style sheet and inline styles for
   *    enhanced readability.
   */
  debug?: boolean;

  /**
   * Options for sorting declarations when multiple rules are passed to the
   * {@link CssFn | `css`} function.
   *
   * @experimental
   */
  sort?: {
    /**
     * When enabled, the last property declared is sorted to the end, giving it
     * the highest priority.
     *
     * @remarks
     * Within a given rule, conditional styles are always treated as the last
     * entry, giving the properties declared within the highest priority within
     * that scope.
     *
     * @experimental
     *
     * @defaultValue true
     */
    properties?: boolean;

    /**
     * When enabled, conditional styles are sorted to the end of the list of
     * rules passed to the `css` function, giving them the highest priority.
     *
     * @remarks
     * You may want to consider disabling this option when
     * - you are publishing a component library;
     * - you expose a `style` prop allowing client overrides; and
     * - you wish to hide CSS Hooks as an implementation detail (meaning that
     *   the `style` prop has the standard type for CSS Properties with no `on`
     *   field).
     *
     * @experimental
     *
     * @defaultValue true
     */
    conditionalStyles?: boolean;
  };

  /**
   * This option allows you to customize how hook names are transformed into
   * valid CSS identifiers. Useful for testing.
   *
   * @internal
   */
  hookNameToId?: (
    hookName: HooksConfig extends Record<infer HookName, unknown>
      ? HookName
      : string,
  ) => string;
}

/**
 * Represents the {@link CssFn | `css`} function used to define enhanced styles,
 * along with the style sheet required to support it.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 */
interface Hooks<HookName, CSSProperties> {
  /**
   * The `css` function used to define enhanced styles.
   */
  css: CssFn<HookName, CSSProperties>;

  /**
   * The style sheet required to support the configured hooks.
   */
  styleSheet: () => string;
}

/**
 * A utility type used to extract hook names from configuration
 *
 * @internal
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type GetHookNames<HooksConfig> = HooksConfig extends (
  _: any,
) => Record<infer HookName, any>
  ? HookName
  : HooksConfig extends Record<infer HookName, unknown>
  ? HookName
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Represents the function used to define hooks and related configuration.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @param config - The configuration used to define hooks and adjust the related
 * functionality as needed depending on the use case.
 */
export type CreateHooksFn<CSSProperties> = <
  HooksConfig extends
    | Record<string, Condition<HookImpl>>
    | ((
        helpers: MatchHelpers<HookImpl>,
      ) => Record<string, Condition<HookImpl>>),
>(
  config: Config<HooksConfig>,
) => Hooks<GetHookNames<HooksConfig>, CSSProperties>;

/**
 * Creates a flavor of CSS Hooks tailored to a specific app framework.
 *
 * @param stringify - The function used to stringify values when merging
 * conditional styles.
 *
 * @returns The `createHooks` function used to bootstrap CSS Hooks within an app
 * or component library.
 *
 * @remarks
 * Primarily for internal use, advanced use cases, or when an appropriate
 * framework integration is not provided.
 */
declare function buildHooksSystem<
  CSSProperties = Record<string, string | number>,
>(stringify?: StringifyFn): CreateHooksFn<CSSProperties>;
