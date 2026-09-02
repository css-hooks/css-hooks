/**
 * CSS Hooks core library
 *
 * @packageDocumentation
 */

/**
 * Represents the conditions under which a given hook or declaration applies.
 *
 * @typeParam S - The basic type of condition to enhance with boolean operations
 *
 * @public
 */
export type Condition<S> =
  S | { and: Condition<S>[] } | { or: Condition<S>[] } | { not: Condition<S> };

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
 * Represents the selector logic used to create a hook.
 *
 * @remarks
 * Three forms are supported:
 *
 * 1. A basic selector, where `&` is used as a placeholder for the element to which
 *    the condition applies. The `&` character must appear somewhere.
 * 2. `@media`, `@container`, and `@supports` at-rules. Each value must begin with
 *    its keyword, followed by a space.
 * 3. `@starting-style` with no additional parameters
 *
 * @public
 */
export type Selector =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`
  | "@starting-style";

/**
 * Resolves the CSS property names that conflict with an override style.
 *
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   they conflict with
 * @typeParam OverrideCSSProperties - The conditional declarations for which
 *   conflicting properties are resolved
 */
type CSSPropertyConflictKeys<
  CSSPropertyConflicts extends object,
  OverrideCSSProperties,
> = CSSPropertyConflicts[keyof OverrideCSSProperties &
  keyof CSSPropertyConflicts] &
  PropertyKey;

/**
 * Prevents conflicting CSS properties from being assigned values in a base
 * style.
 *
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 * @typeParam OverrideCSSProperties - The conditional declarations for which
 *   conflicting properties are forbidden
 */
type ForbidCSSPropertyConflicts<
  CSSPropertyConflicts extends object,
  OverrideCSSProperties,
> = {
  [
    P in CSSPropertyConflictKeys<CSSPropertyConflicts, OverrideCSSProperties>
  ]?: never;
};

/** Preserves a style's shape while replacing conflicting property values. */
type CSSPropertiesWithoutConflicts<
  CSSProperties,
  CSSPropertyConflicts extends object,
  OverrideCSSProperties,
> = {
  [P in keyof CSSProperties]: P extends CSSPropertyConflictKeys<
    CSSPropertyConflicts,
    OverrideCSSProperties
  >
    ? never
    : CSSProperties[P];
} & ForbidCSSPropertyConflicts<CSSPropertyConflicts, OverrideCSSProperties>;

/**
 * An object containing the functions needed to support and use the configured
 * hooks
 *
 * @typeParam S - The type of the selector logic for which to generate hooks
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 *
 * @public
 */
export interface CreateHooksResult<
  S,
  CSSProperties,
  CSSPropertyConflicts extends object,
> {
  /**
   * Creates a function that enhances a style object with conditional override
   * styles.
   */
  on: <
    OverrideCSSProperties extends CSSProperties,
    BaseCSSProperties extends Omit<
      CSSProperties,
      CSSPropertyConflictKeys<CSSPropertyConflicts, OverrideCSSProperties>
    >,
  >(
    condition: Condition<S>,
    overrideStyle: OverrideCSSProperties,
  ) => (
    style: CSSPropertiesWithoutConflicts<
      CSSProperties & BaseCSSProperties,
      CSSPropertyConflicts,
      OverrideCSSProperties
    >,
  ) => BaseCSSProperties & OverrideCSSProperties;

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
  and: <C extends Condition<S>[]>(...conditions: C) => { and: C };

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
  or: <C extends Condition<S>[]>(...conditions: C) => { or: C };

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
  not: <C extends Condition<S>>(condition: C) => { not: C };

  /** Returns the style sheet required to support the configured hooks. */
  styleSheet: () => string;
}

/**
 * Represents the function used to define hooks and related configuration.
 *
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 * @typeParam S - The type of selectors for which to create hooks
 *
 * @param selectors - The selectors for which to create hooks
 *
 * @returns An object containing the functions needed to support and use the
 *   configured hooks
 *
 * @public
 */
export type CreateHooksFn<
  CSSProperties,
  CSSPropertyConflicts extends object = object,
> = <S extends Selector>(
  ...selectors: S[]
) => CreateHooksResult<S, CSSProperties, CSSPropertyConflicts>;

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
 * @returns The `createHooks` function used to bootstrap CSS Hooks within an app
 *   or component library
 *
 * @public
 */
export function buildHooksSystem<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  CSSProperties extends { [P: string]: any } = Record<string, unknown>,
  CSSPropertyConflicts extends object = object,
>(
  stringify: StringifyFn = String,
): CreateHooksFn<CSSProperties, CSSPropertyConflicts> {
  return (...selectors: string[]) => {
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

    const selectorHashes = new Map(
      selectors.map(selector => [selector, createHash(selector)]),
    );

    return {
      styleSheet() {
        const indent = Array(2).fill(space).join("");
        return `*${space}{${newline}${selectors
          .flatMap(selector => [
            `${indent}--${selectorHashes.get(selector)}0:${space}initial;`,
            `${indent}--${selectorHashes.get(selector)}1:${space};`,
          ])
          .join(newline)}${newline}}${newline}${selectors
          .flatMap(def => {
            if (def.startsWith("@")) {
              return [
                `${def} {`,
                `${indent}* {`,
                `${indent}${indent}--${selectorHashes.get(def)}0:${space};`,
                `${indent}${indent}--${selectorHashes.get(def)}1:${space}initial;`,
                `${indent}}`,
                "}",
              ];
            }
            return [
              `${def.replace(/&/g, "*")}${space}{`,
              `${indent}--${selectorHashes.get(def)}0:${space};`,
              `${indent}--${selectorHashes.get(def)}1:${space}initial;`,
              "}",
            ];
          })
          .join(newline)}`;
      },
      and: (...and) => ({ and }),
      or: (...or) => ({ or }),
      not: not => ({ not }),
      on(condition, overrideStyle) {
        return <ActualBaseCSSProperties extends CSSProperties>(
          fallbackStyle: ActualBaseCSSProperties,
        ) => {
          const style = { ...fallbackStyle };
          for (const property in overrideStyle) {
            const overrideValue = stringify(overrideStyle[property], property);
            if (overrideValue === null) {
              continue;
            }
            let fallbackValue = "revert-layer";
            if (property in style) {
              const fv = stringify(style[property], property);
              if (fv !== null) {
                fallbackValue = fv;
              }
            }
            const [value, extraDecls] = buildExpression(
              condition,
              overrideValue,
              fallbackValue,
            );
            Object.assign(style, { [property]: value }, extraDecls);
          }
          return style as typeof style & typeof overrideStyle;
          function buildExpression(
            condition: string | Condition<string>,
            valueIfTrue: string,
            valueIfFalse: string,
          ): [string, Record<string, string>] {
            if (typeof condition === "string") {
              let valTrue = valueIfTrue,
                valFalse = valueIfFalse;
              const extraDecls: Record<string, string> = {};
              if (valTrue.length > 32) {
                const hash = createHash(valTrue);
                extraDecls[`--${hash}`] = valTrue;
                valTrue = `var(--${hash})`;
              }
              if (valFalse.length > 32) {
                const hash = createHash(valFalse);
                extraDecls[`--${hash}`] = valFalse;
                valFalse = `var(--${hash})`;
              }
              const selectorHash =
                selectorHashes.get(condition) || createHash(condition);
              return [
                `var(--${selectorHash}1,${space}${valTrue})${space}var(--${selectorHash}0,${space}${valFalse})`,
                extraDecls,
              ];
            }
            if ("and" in condition) {
              const [head, ...tail] = condition.and;
              if (!head) {
                return [valueIfTrue, {}];
              }
              if (tail.length === 0) {
                return buildExpression(head, valueIfTrue, valueIfFalse);
              }
              const [tailExpr, tailDecls] = buildExpression(
                { and: tail },
                valueIfTrue,
                valueIfFalse,
              );
              const [expr, decls] = buildExpression(
                head,
                tailExpr,
                valueIfFalse,
              );
              return [expr, { ...decls, ...tailDecls }];
            }
            if ("or" in condition) {
              return buildExpression(
                { and: condition.or.map(not => ({ not })) },
                valueIfFalse,
                valueIfTrue,
              );
            }
            if (condition.not) {
              return buildExpression(condition.not, valueIfFalse, valueIfTrue);
            }
            throw new Error(`Invalid condition: ${JSON.stringify(condition)}`);
          }
        };
      },
    };
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
