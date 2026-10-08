/**
 * CSS Hooks core library
 *
 * @packageDocumentation
 */

/**
 * Represents a hook or combination of hooks that can activate declarations.
 *
 * @typeParam H - The basic hook type to enhance with boolean operations
 *
 * @public
 */
export type Condition<H> =
  H | { and: Condition<H>[] } | { or: Condition<H>[] } | { not: Condition<H> };

/**
 * Function to convert a value into a string
 *
 * @remarks
 * Used for merging a conditional property value with the fallback value
 *
 * @param value - The value to stringify
 * @param propertyName - The property name corresponding to the value being
 *   stringified
 *
 * @returns The stringified value, or `null` if the value cannot be stringified
 *
 * @public
 */
export type StringifyFn = (
  value: unknown,
  propertyName: string,
) => string | null;

/**
 * Represents a hook declared with `createHooks`.
 *
 * @remarks
 * Four forms are supported:
 *
 * 1. A selector hook, where `&` is used as a placeholder for the element for which
 *    the hook activates. The `&` character must appear somewhere.
 * 2. An at-rule hook beginning with `@media`, `@container`, `@supports`, or
 *    `@scope`, followed by a space. `@scope` requires an explicit scope root.
 * 3. The `@starting-style` at-rule hook with no additional parameters.
 * 4. A named boolean flag hook beginning with `%`.
 *
 * @public
 */
export type Hook =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`
  | `@scope (${string})`
  | "@starting-style"
  | `%${string}`;

/** Extracts the flags in a hook tuple. */
type Flag<Hooks extends readonly Hook[]> = Extract<Hooks[number], `%${string}`>;

/** Style declarations that set a flag for an element and its descendants */
type FlagStyle = { [P in `--${string}`]: string };

const fallbackMarker = "var(--ch-revert-layer,revert-layer)";
const fallbackMarkerPattern = /var\(--ch-revert-layer,revert-layer\)/g;

/**
 * Extracts the keys known to be present in each object in a union.
 *
 * @remarks
 * Unlike `keyof`, this excludes optional keys and distributes over union
 * members. For an exact object type it produces the same keys as `keyof`, while
 * a broad type such as `CSSProperties` contributes no keys because its
 * properties are optional. This lets broad style inputs participate in a merge
 * without introducing false conflicts or erasing keys known from other inputs.
 *
 * @typeParam T - The object or union of objects whose known-present keys are
 *   extracted
 */
type PresentKeys<T> = T extends object
  ? {
      [P in keyof T]-?: Record<never, never> extends Pick<T, P> ? never : P;
    }[keyof T]
  : never;

/**
 * Marks known-present properties that conflict with previous styles as `never`.
 *
 * @typeParam Style - The style being validated
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 * @typeParam PreviousStyles - The previously merged styles whose known-present
 *   properties are checked for conflicts
 */
type StyleConflictConstraint<
  Style extends object,
  CSSPropertyConflicts extends object,
  PreviousStyles,
> = {
  [P in PresentKeys<Style> & keyof Style]: P extends keyof CSSPropertyConflicts
    ? Extract<
        CSSPropertyConflicts[P],
        PresentKeys<PreviousStyles>
      > extends never
      ? Style[P]
      : never
    : Style[P];
};

/**
 * Applies the known-present properties of an override style to a base style.
 *
 * @typeParam BaseStyle - The style being overridden
 * @typeParam OverrideStyle - The style whose known-present properties take
 *   precedence
 */
type MergeStyle<BaseStyle, OverrideStyle> = Omit<
  BaseStyle,
  PresentKeys<OverrideStyle>
> &
  OverrideStyle;

/**
 * Applies a style input to a base style, ignoring an absent input.
 *
 * @typeParam BaseStyle - The accumulated style
 * @typeParam Input - The next style object or absent style input
 */
type ApplyStyleInput<
  BaseStyle,
  Input extends object | null | undefined,
> = Input extends null | undefined ? BaseStyle : MergeStyle<BaseStyle, Input>;

/**
 * Applies style inputs from left to right to produce their merged style type.
 *
 * @typeParam BaseStyle - The initial accumulated style
 * @typeParam Inputs - The style inputs to apply in order
 */
type MergeStyleInputs<
  BaseStyle,
  Inputs extends readonly (object | null | undefined)[],
> = Inputs extends readonly [
  infer Input extends object | null | undefined,
  ...infer Rest extends readonly (object | null | undefined)[],
]
  ? MergeStyleInputs<ApplyStyleInput<BaseStyle, Input>, Rest>
  : BaseStyle;

/**
 * A style object that may be absent.
 *
 * @remarks
 * Including `null` and `undefined` lets optional style objects be passed to
 * `mergeStyles` without first checking whether they are present.
 *
 * @typeParam CSSProperties - The configured style object type
 */
type StyleInput<CSSProperties extends object> =
  CSSProperties | null | undefined;

/**
 * Constrains a style input against the known-present properties of previous
 * inputs.
 *
 * @remarks
 * The outer `Input &` intentionally exposes `Input` outside the conditional
 * type so TypeScript infers the exact argument type before checking conflicts.
 * Using only the conditional type can instead widen the argument to the
 * configured style type, whose optional properties provide no known-present
 * keys to check.
 *
 * @typeParam CSSProperties - The configured style object type
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 * @typeParam PreviousInputs - The style inputs preceding the input being
 *   checked
 * @typeParam Input - The style input being checked
 */
type CheckedStyleInput<
  CSSProperties extends object,
  CSSPropertyConflicts extends object,
  PreviousInputs extends readonly unknown[],
  Input extends StyleInput<CSSProperties>,
> = Input &
  (Input extends null | undefined
    ? Input
    : StyleConflictConstraint<
        Input & object,
        CSSPropertyConflicts,
        PreviousInputs[number]
      >);

/**
 * Produces the merged style type for inputs applied to an empty base style.
 *
 * @typeParam Inputs - The style inputs to merge from left to right
 */
type Merged<Inputs extends readonly (object | null | undefined)[]> =
  MergeStyleInputs<object, Inputs>;

/**
 * Merges up to 26 style inputs from left to right.
 *
 * @remarks
 * Each input after the first is checked against the known-present properties of
 * every preceding input.
 *
 * @typeParam CSSProperties - The configured style object type
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 */
type MergeStylesFn<
  CSSProperties extends object,
  CSSPropertyConflicts extends object,
> = {
  <const A extends StyleInput<CSSProperties>>(
    a: A,
  ): MergeStyleInputs<object, [A]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
  ): MergeStyleInputs<object, [A, B]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
  ): MergeStyleInputs<object, [A, B, C]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
  ): MergeStyleInputs<object, [A, B, C, D]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
  ): MergeStyleInputs<object, [A, B, C, D, E]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
  ): MergeStyleInputs<object, [A, B, C, D, E, F]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
  ): MergeStyleInputs<object, [A, B, C, D, E, F, G]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
  ): Merged<[A, B, C, D, E, F, G, H]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
    const S extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
    s: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R],
      S
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
    const S extends StyleInput<CSSProperties>,
    const T extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
    s: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R],
      S
    >,
    t: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S],
      T
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
    const S extends StyleInput<CSSProperties>,
    const T extends StyleInput<CSSProperties>,
    const U extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
    s: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R],
      S
    >,
    t: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S],
      T
    >,
    u: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T],
      U
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
    const S extends StyleInput<CSSProperties>,
    const T extends StyleInput<CSSProperties>,
    const U extends StyleInput<CSSProperties>,
    const V extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
    s: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R],
      S
    >,
    t: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S],
      T
    >,
    u: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T],
      U
    >,
    v: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U],
      V
    >,
  ): Merged<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V]>;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
    const S extends StyleInput<CSSProperties>,
    const T extends StyleInput<CSSProperties>,
    const U extends StyleInput<CSSProperties>,
    const V extends StyleInput<CSSProperties>,
    const W extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
    s: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R],
      S
    >,
    t: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S],
      T
    >,
    u: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T],
      U
    >,
    v: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U],
      V
    >,
    w: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V],
      W
    >,
  ): Merged<
    [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W]
  >;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
    const S extends StyleInput<CSSProperties>,
    const T extends StyleInput<CSSProperties>,
    const U extends StyleInput<CSSProperties>,
    const V extends StyleInput<CSSProperties>,
    const W extends StyleInput<CSSProperties>,
    const X extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
    s: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R],
      S
    >,
    t: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S],
      T
    >,
    u: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T],
      U
    >,
    v: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U],
      V
    >,
    w: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V],
      W
    >,
    x: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W],
      X
    >,
  ): Merged<
    [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X]
  >;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
    const S extends StyleInput<CSSProperties>,
    const T extends StyleInput<CSSProperties>,
    const U extends StyleInput<CSSProperties>,
    const V extends StyleInput<CSSProperties>,
    const W extends StyleInput<CSSProperties>,
    const X extends StyleInput<CSSProperties>,
    const Y extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
    s: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R],
      S
    >,
    t: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S],
      T
    >,
    u: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T],
      U
    >,
    v: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U],
      V
    >,
    w: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V],
      W
    >,
    x: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W],
      X
    >,
    y: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X],
      Y
    >,
  ): Merged<
    [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y]
  >;
  <
    const A extends StyleInput<CSSProperties>,
    const B extends StyleInput<CSSProperties>,
    const C extends StyleInput<CSSProperties>,
    const D extends StyleInput<CSSProperties>,
    const E extends StyleInput<CSSProperties>,
    const F extends StyleInput<CSSProperties>,
    const G extends StyleInput<CSSProperties>,
    const H extends StyleInput<CSSProperties>,
    const I extends StyleInput<CSSProperties>,
    const J extends StyleInput<CSSProperties>,
    const K extends StyleInput<CSSProperties>,
    const L extends StyleInput<CSSProperties>,
    const M extends StyleInput<CSSProperties>,
    const N extends StyleInput<CSSProperties>,
    const O extends StyleInput<CSSProperties>,
    const P extends StyleInput<CSSProperties>,
    const Q extends StyleInput<CSSProperties>,
    const R extends StyleInput<CSSProperties>,
    const S extends StyleInput<CSSProperties>,
    const T extends StyleInput<CSSProperties>,
    const U extends StyleInput<CSSProperties>,
    const V extends StyleInput<CSSProperties>,
    const W extends StyleInput<CSSProperties>,
    const X extends StyleInput<CSSProperties>,
    const Y extends StyleInput<CSSProperties>,
    const Z extends StyleInput<CSSProperties>,
  >(
    a: A,
    b: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A], B>,
    c: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B], C>,
    d: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C], D>,
    e: CheckedStyleInput<CSSProperties, CSSPropertyConflicts, [A, B, C, D], E>,
    f: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E],
      F
    >,
    g: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F],
      G
    >,
    h: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G],
      H
    >,
    i: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H],
      I
    >,
    j: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I],
      J
    >,
    k: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J],
      K
    >,
    l: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K],
      L
    >,
    m: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L],
      M
    >,
    n: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M],
      N
    >,
    o: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N],
      O
    >,
    p: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O],
      P
    >,
    q: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P],
      Q
    >,
    r: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q],
      R
    >,
    s: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R],
      S
    >,
    t: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S],
      T
    >,
    u: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T],
      U
    >,
    v: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U],
      V
    >,
    w: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V],
      W
    >,
    x: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W],
      X
    >,
    y: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X],
      Y
    >,
    z: CheckedStyleInput<
      CSSProperties,
      CSSPropertyConflicts,
      [
        A,
        B,
        C,
        D,
        E,
        F,
        G,
        H,
        I,
        J,
        K,
        L,
        M,
        N,
        O,
        P,
        Q,
        R,
        S,
        T,
        U,
        V,
        W,
        X,
        Y,
      ],
      Z
    >,
  ): Merged<
    [
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K,
      L,
      M,
      N,
      O,
      P,
      Q,
      R,
      S,
      T,
      U,
      V,
      W,
      X,
      Y,
      Z,
    ]
  >;
};

/**
 * An object containing the functions needed to support and use the configured
 * hooks
 *
 * @typeParam ConfiguredHooks - The tuple of configured hooks
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 *
 * @public
 */
export type Hooks<ConfiguredHooks extends readonly Hook[], CSSProperties> = {
  /** Creates a style object with conditional declarations. */
  on: <const Style extends CSSProperties>(
    condition: Condition<ConfiguredHooks[number]>,
    style: Style,
  ) => Style;

  /**
   * Combines a list of conditions into a single condition which is true when
   * all of the specified conditions are true.
   *
   * @typeParam C - The type of the conditions which must all be true in order
   *   for the condition to be true
   *
   * @param conditions - The conditions which must all be true in order for the
   *   condition to be true
   *
   * @returns A condition that is true when all of the specified conditions are
   *   true
   */
  and: <C extends Condition<ConfiguredHooks[number]>[]>(
    ...conditions: C
  ) => {
    and: C;
  };

  /**
   * Combines a list of conditions into a single condition which is true when
   * any of the specified conditions are true.
   *
   * @typeParam C - The type of the conditions any one of which must be true in
   *   order for the condition to be true
   *
   * @param conditions - The conditions any one of which must be true in order
   *   for the condition to be true
   *
   * @returns A condition that is true when any of the specified conditions are
   *   true
   */
  or: <C extends Condition<ConfiguredHooks[number]>[]>(
    ...conditions: C
  ) => {
    or: C;
  };

  /**
   * Negates a condition.
   *
   * @typeParam C - The type of the condition which must be false in order for
   *   the resulting condition to be true
   *
   * @param condition - The condition which must be false in order for the
   *   resulting condition to be true
   *
   * @returns A condition that is true when the specified condition is false.
   */
  not: <C extends Condition<ConfiguredHooks[number]>>(
    condition: C,
  ) => {
    not: C;
  };

  /** Returns the stylesheet required to support the declared hooks. */
  styleSheet: () => string;
} & (`%${string}` extends Flag<ConfiguredHooks>
  ? unknown
  : [Flag<ConfiguredHooks>] extends [never]
    ? unknown
    : {
        /**
         * Returns style declarations that enable flags for the element and its
         * descendants.
         */
        enable: (
          flag: Flag<ConfiguredHooks>,
          ...flags: Flag<ConfiguredHooks>[]
        ) => FlagStyle;

        /**
         * Returns style declarations that disable flags for the element and its
         * descendants.
         */
        disable: (
          flag: Flag<ConfiguredHooks>,
          ...flags: Flag<ConfiguredHooks>[]
        ) => FlagStyle;
      });

/**
 * Represents the function used to declare hooks and related configuration.
 *
 * @remarks
 * When the declared hooks are known to include one or more `%<name>` values,
 * the return type also exposes `enable` and `disable` functions restricted to
 * those flags.
 *
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 * @typeParam ConfiguredHooks - The tuple of hooks to declare
 *
 * @param hooks - The hooks to declare
 *
 * @returns An object containing the functions needed to support and use the
 *   declared hooks
 *
 * @public
 */
export type CreateHooksFn<CSSProperties> = <
  const ConfiguredHooks extends Hook[],
>(
  ...hooks: ConfiguredHooks
) => Hooks<ConfiguredHooks, CSSProperties>;

/**
 * The functions configured by `createHooksSystem` for a specific app framework
 *
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 *
 * @public
 */
export type HooksSystem<
  CSSProperties extends object,
  CSSPropertyConflicts extends object = object,
> = {
  /** Creates functions for the declared hooks. */
  createHooks: CreateHooksFn<CSSProperties>;

  /** Merges style objects from left to right. */
  mergeStyles: MergeStylesFn<CSSProperties, CSSPropertyConflicts>;
};

/**
 * Creates a flavor of CSS Hooks tailored to a specific app framework.
 *
 * @remarks
 * Primarily for internal use, advanced use cases, or when an appropriate
 * framework integration is not provided
 *
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 *
 * @param stringify - The function used to stringify values when merging
 *   override styles
 *
 * @returns The functions used to bootstrap CSS Hooks within an app or component
 *   library
 *
 * @public
 */
export function createHooksSystem<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  CSSProperties extends { [P: string]: any } = Record<string, unknown>,
  CSSPropertyConflicts extends object = object,
>(
  stringify: StringifyFn = String,
): HooksSystem<CSSProperties, CSSPropertyConflicts> {
  const mergeStyles = (...inputs: (object | null | undefined)[]): object => {
    let result: Record<PropertyKey, unknown> = {};
    for (const input of inputs) {
      if (!input) {
        continue;
      }
      const merged = { ...result };
      for (const property of Reflect.ownKeys(input)) {
        if (!Object.prototype.propertyIsEnumerable.call(input, property)) {
          continue;
        }
        Reflect.deleteProperty(merged, property);
        const value = (input as Record<PropertyKey, unknown>)[property];
        if (
          typeof property === "string" &&
          typeof value === "string" &&
          value.includes(fallbackMarker)
        ) {
          const fallbackValue =
            property in result ? stringify(result[property], property) : null;
          merged[property] = value.replace(
            fallbackMarkerPattern,
            () => fallbackValue ?? "revert-layer",
          );
        } else {
          merged[property] = value;
        }
      }
      result = merged;
    }
    return result;
  };

  const createHooks: CreateHooksFn<CSSProperties> = <
    const Hooks extends Hook[],
  >(
    ...hooks: Hooks
  ) => {
    let space = "";
    let newline = "";
    try {
      // @ts-expect-error bundler expected to replace `process.env.NODE_ENV` expression
      if (process.env.NODE_ENV === "development") {
        space = " ";
        newline = "\n";
      }
    } catch {
      // `process.env.NODE_ENV` is absent in unbundled browser environments
    }

    // The "off" value for flag variables. It resolves to a truly-empty value
    // (so `var()` treats it as empty rather than substituting its fallback),
    // without introducing whitespace that would accumulate when composed
    // through nested `var()` expressions. `--ch-empty` is never defined.
    const empty = "var(--ch-empty, )";

    const hookHashes = new Map<string, string>(
      hooks.map(hook => [hook, createHash(hook)]),
    );

    // Names a hook's custom property: `--{hash}` with suffix
    const hookVar = (hash: string, suffix = ""): string => `--${hash}${suffix}`;

    const flagVars = (hash: string) =>
      [
        "0", // off
        "1", // on
        "0s", // off (seed)
        "1s", // on (seed)
      ].map(suffix => hookVar(hash, suffix));

    const flagKeys = new Set(
      hooks
        .filter(hook => hook.startsWith("%"))
        .flatMap(hook => {
          const hash = hookHashes.get(hook);
          return hash ? flagVars(hash) : [];
        }),
    );

    const flagDeclarations = (flags: string[], enabled: boolean) => {
      if (flags.length === 0) {
        throw new RangeError("At least one flag is required");
      }
      return Object.fromEntries(
        flags.flatMap(flag => {
          const hash = hookHashes.get(flag);
          if (!flag.startsWith("%") || !hash) {
            throw new RangeError(`Unknown flag: ${flag}`);
          }
          const [off, on, offSeed, onSeed] = flagVars(hash);
          return [
            [off, enabled ? empty : "initial"],
            [on, enabled ? "initial" : empty],
            [offSeed, enabled ? empty : "initial"],
            [onSeed, enabled ? "initial" : empty],
          ];
        }),
      ) as FlagStyle;
    };

    // Hoists a long value into its own custom property, returning a `var()`
    // reference to it. Keeps the generated conditional expressions short.
    const hoist = (
      value: string,
      extraDecls: Record<string, string>,
    ): string => {
      if (value.includes(fallbackMarker) || value.length <= 32) {
        return value;
      }
      const hash = createHash(value);
      extraDecls[`--${hash}`] = value;
      return `var(--${hash})`;
    };

    // Builds the `var()` expression that selects `valueIfTrue` when the
    // condition matches and `valueIfFalse` otherwise. `suffix` is `"i"` when
    // the condition should read the inherited flag variables (`--{hash}*i`)
    // rather than the element's own (`--{hash}*`).
    const buildExpression = (
      condition: string | Condition<string>,
      valueIfTrue: string,
      valueIfFalse: string,
      suffix: "" | "i" = "",
    ): [string, Record<string, string>] => {
      if (typeof condition === "string") {
        const extraDecls: Record<string, string> = {};
        const valTrue = hoist(valueIfTrue, extraDecls);
        const valFalse = hoist(valueIfFalse, extraDecls);
        const hookHash = hookHashes.get(condition) || createHash(condition);
        const conditionSuffix = condition.startsWith("%") ? suffix : "";
        return [
          `var(${hookVar(hookHash, `1${conditionSuffix}`)},${valTrue})var(${hookVar(hookHash, `0${conditionSuffix}`)},${valFalse})`,
          extraDecls,
        ];
      }
      if ("and" in condition) {
        const [head, ...tail] = condition.and;
        if (!head) {
          return [valueIfTrue, {}];
        }
        if (tail.length === 0) {
          return buildExpression(head, valueIfTrue, valueIfFalse, suffix);
        }
        const [tailExpr, tailDecls] = buildExpression(
          { and: tail },
          valueIfTrue,
          valueIfFalse,
          suffix,
        );
        const [expr, decls] = buildExpression(
          head,
          tailExpr,
          valueIfFalse,
          suffix,
        );
        return [expr, { ...decls, ...tailDecls }];
      }
      if ("or" in condition) {
        // De Morgan: `a || b` is equivalent to `!(¬a && ¬b)`.
        return buildExpression(
          { and: condition.or.map(c => ({ not: c })) },
          valueIfFalse,
          valueIfTrue,
          suffix,
        );
      }
      if (condition.not) {
        return buildExpression(
          condition.not,
          valueIfFalse,
          valueIfTrue,
          suffix,
        );
      }
      throw new Error(`Invalid condition: ${JSON.stringify(condition)}`);
    };

    return {
      enable: (...flags: [string, ...string[]]) =>
        flagDeclarations(flags, true),
      disable: (...flags: [string, ...string[]]) =>
        flagDeclarations(flags, false),
      styleSheet() {
        type Ruleset = [string[], { [P: string]: string } | Ruleset];

        const parityVariable = "--ch-parity";
        const evenQuery = `@container not style(${parityVariable}:${space})`;
        const oddQuery = `@container style(${parityVariable}:${space})`;

        return hooks
          .flatMap((hook): Ruleset[] => {
            const hookHash = hookHashes.get(hook)!;

            const offVariable = hookVar(hookHash, "0");
            const onVariable = hookVar(hookHash, "1");

            if (hook.startsWith("%")) {
              const rulesets: Ruleset[] = ["0", "1"].flatMap(lane => {
                const valueVariable = hookVar(hookHash, lane);
                const evenVariable = hookVar(hookHash, lane + "e");
                const oddVariable = hookVar(hookHash, lane + "o");
                const seedVariable = hookVar(hookHash, lane + "s");
                const inheritedVariable = hookVar(hookHash, lane + "i");
                return [
                  [
                    [evenQuery],
                    [
                      ["*"],
                      {
                        [evenVariable]: `var(${seedVariable})`,
                        [inheritedVariable]: `var(${oddVariable})`,
                      },
                    ],
                  ],
                  [
                    [oddQuery],
                    [
                      ["*"],
                      {
                        [oddVariable]: `var(${seedVariable})`,
                        [inheritedVariable]: `var(${evenVariable})`,
                      },
                    ],
                  ],
                  [
                    ["*"],
                    {
                      [valueVariable]: `var(${inheritedVariable})`,
                    },
                  ],
                ];
              });
              // Initialize each flag to its "off" state on the root element, so
              // that when no ancestor ever enables or disables it, it reads as
              // "off" rather than "unset". These custom properties inherit, so
              // the default propagates to the whole tree unless overridden.
              rulesets.push([
                [":root"],
                {
                  [hookVar(hookHash, "0s")]: "initial",
                  [hookVar(hookHash, "1s")]: empty,
                },
              ]);
              return rulesets;
            }

            const offDeclarations = {
              [offVariable]: "initial",
              [onVariable]: empty,
            };
            const onDeclarations = {
              [offVariable]: empty,
              [onVariable]: "initial",
            };

            const rulesets: Ruleset[] = [[["*"], offDeclarations]];

            if (hook.startsWith("@")) {
              const target = ["*"];
              if (hook.startsWith("@scope")) {
                target.push(":scope");
              }
              rulesets.push([[hook], [target, onDeclarations]]);
            } else {
              rulesets.push([
                [`:where(${hook.replace(/&/g, "*")})`],
                onDeclarations,
              ]);
            }

            return rulesets;
          })
          .concat(
            hooks.some(hook => hook.startsWith("%"))
              ? [
                  [[evenQuery], [["*"], { [parityVariable]: space }]],
                  [[oddQuery], [["*"], { [parityVariable]: "initial" }]],
                ]
              : [],
          )
          .map(
            unary(function render(ruleset: Ruleset, level: number = 0): string {
              const [headers, declarations] = ruleset;
              const indent = Array(level * 2)
                .fill(space)
                .join("");
              if (Array.isArray(declarations)) {
                return `${indent}${headers.join(`,${space}`)}${space}{${newline}${render(
                  declarations,
                  level + 1,
                )}${newline}${indent}}`;
              }
              return `${indent}${headers.join(`,${space}`)}${space}{${newline}${Object.entries(
                declarations,
              )
                .map(
                  ([property, value]) =>
                    `${indent}${space}${property}:${space}${value};`,
                )
                .join(newline)}${newline}${indent}}`;
            }),
          )
          .join(newline);
      },
      and: (...and) => ({ and }),
      or: (...or) => ({ or }),
      not: not => ({ not }),
      on(condition, inputStyle) {
        const style = {} as CSSProperties;
        for (const property in inputStyle) {
          const suffix = flagKeys.has(property) ? "i" : "";
          const overrideValue = stringify(inputStyle[property], property);
          if (overrideValue === null) {
            continue;
          }
          const [value, extraDecls] = buildExpression(
            condition,
            overrideValue,
            fallbackMarker,
            suffix,
          );
          Object.assign(style, { [property]: value }, extraDecls);
        }
        return style as typeof inputStyle;
      },
    };
  };

  return {
    createHooks,
    mergeStyles: mergeStyles as HooksSystem<
      CSSProperties,
      CSSPropertyConflicts
    >["mergeStyles"],
  };
}

const hashAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-_";
const hashAlphabetLength = hashAlphabet.length;

function createHash(value: string) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 0x9e3779b1);
    h2 = Math.imul(h2 ^ code, 0x5f356495);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 0x85ebca6b) ^
    Math.imul(h2 ^ (h2 >>> 13), 0xc2b2ae35);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 0x85ebca6b) ^
    Math.imul(h1 ^ (h1 >>> 13), 0xc2b2ae35);

  let hash = (h1 >>> 0) + 0x100000000 * (h2 & 0xf);
  let encoded = "";

  for (let i = 0; i < 7; i++) {
    encoded = hashAlphabet.charAt(hash % hashAlphabetLength) + encoded;
    hash = Math.floor(hash / hashAlphabetLength);
  }

  return encoded;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unary<A, B>(fn: (a: A, ...rest: any) => B): (a: A) => B {
  return (a: A) => fn(a);
}
