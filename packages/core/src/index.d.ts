/**
 * CSS Hooks core library
 *
 * @packageDocumentation
 */

/**
 * Represents the conditions under which a given hook or declaration applies.
 *
 * @typeParam S - The basic type of condition to enhance with boolean
 * operations.
 *
 * @public
 */
export type Condition<S> =
  | S
  | { and: Condition<S>[] }
  | { or: Condition<S>[] }
  | { not: Condition<S> };

/**
 * Function to convert a value into a string.
 *
 * @param propertyName - The property name corresponding to the value being
 * stringified
 *
 * @param value - The value to stringify
 *
 * @remarks
 * Used for merging an override property value with the default/fallback value.
 *
 * @returns The stringified value or `null` if the value can't be stringified.
 *
 * @public
 */
export type StringifyFn = (
  propertyName: string,
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
 *
 * @public
 */
export type ConditionalStyleFn<HookName, CSSProperties> = (
  condition: Condition<HookName>,
  style: CSSProperties,
) => [Condition<HookName>, CSSProperties];

/**
 * Helper functions used to construct advanced conditions.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 *
 * @public
 */
export interface ConditionHelpers<HookName> {
  /**
   * Creates a condition that is true when all of the conditions passed as
   * arguments are true.
   */
  and(...conditions: Condition<HookName>[]): Condition<HookName>;

  /**
   * Creates a condition that is true when any of the conditions passed as
   * arguments is true.
   */
  or(...conditions: Condition<HookName>[]): Condition<HookName>;

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
 *
 * @public
 */
export type OnFn<HookName, CSSProperties> = (
  /**
   * The callback used to construct a conditional style group.
   */
  $: ConditionalStyleFn<HookName, CSSProperties>,

  /**
   * Helper functions used to construct advanced conditions.
   */
  helpers: ConditionHelpers<HookName>,
) => [Condition<HookName>, CSSProperties][];

/**
 * Represents a style object, optionally enhanced with inline styles.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @public
 */
export type Rule<HookName, CSSProperties> = CSSProperties & {
  /**
   * The function used to apply conditional styles
   */
  on?: OnFn<HookName, CSSProperties>;
};

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
 *
 * @public
 */
export type CssFn<HookName, CSSProperties> = (
  /**
   * A style object, optionally enhanced with conditional styles.
   */
  style: Rule<HookName, CSSProperties>,

  /**
   * A list of style objects, each optionally enhanced with conditional styles.
   *
   * @beta
   */
  ...styles: (Rule<HookName, CSSProperties> | undefined)[]
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
 *
 * @public
 */
export type HookImpl =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`;

/**
 * Represents the configuration used to set up hooks.
 *
 * @typeParam Hooks - the hooks configured for use in conditional styles.
 *
 * @public
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
   * @defaultValue false
   *
   * @remarks
   *
   * When debug mode is enabled:
   *
   * 1. The style sheet returned by the `styleSheet` function is pretty-printed.
   *
   * 2. Extra white space is included in inline style declarations for improved
   *    readability.
   *
   * 3. Hook identifiers (underlying CSS variables) are tagged with user-defined
   *    hook names.
   */
  debug?: boolean;

  /**
   * Options for sorting declarations when multiple rules are passed to the
   * {@link CssFn | `css`} function.
   *
   * @beta
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
     * @beta
     *
     * @defaultValue true
     */
    properties?: boolean;

    /**
     * When enabled, conditional styles are sorted to the end of the list of
     * rules passed to the `css` function, always giving them the highest
     * priority.
     *
     * @beta
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
  hookNameToId?: (hookName: GetHookNames<Hooks>) => string;
}

/**
 * Represents the {@link CssFn} used to define enhanced styles, along with the
 * style sheet required to support it.
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @public
 */
export interface Hooks<HookName, CSSProperties> {
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
 * @public
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
 *
 * @public
 */
export type CreateHooksFn<CSSProperties> = <
  HooksConfig extends
    | Record<string, Condition<HookImpl>>
    | ((
        helpers: ConditionHelpers<HookImpl>,
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
 *
 * @public
 */
declare function buildHooksSystem<CSSProperties = Record<string, unknown>>(
  stringify?: StringifyFn,
): CreateHooksFn<CSSProperties>;
