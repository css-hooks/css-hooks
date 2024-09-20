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
 * @param value - The value to stringify
 *
 * @param propertyName - The property name corresponding to the value being
 * stringified
 *
 * @remarks
 * Used for merging a conditional property value with the fallback value.
 *
 * @returns The stringified value, or `undefined` if the value cannot be
 * stringified
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
 * Two types are supported:
 * 1. A basic selector, where `&` is used as a placeholder for the element to
 *    which the condition applies. The `&` character must appear somewhere.
 * 2. A `@media`, `@container`, or `@supports` at-rule. The value must begin
 *    with one of these keywords, followed by a space.
 *
 * @public
 */
export type Selector =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`;

/**
 * Enhances a style object by merging in conditional declarations.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @param style - The original style object containing default/fallback values
 *
 * @returns An enhanced style object with conditional styles applied
 *
 * @public
 */
export type EnhanceStyleFn<CSSProperties> = (
  style: CSSProperties,
) => CSSProperties;

/**
 * An object containing the functions needed to support and use the configured
 * hooks.
 *
 * @typeParam S - The type of the selector logic for which to generate hooks
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @public
 */
export interface CreateHooksResult<S, CSSProperties> {
  /**
   * Enhances a style object with conditional styles.
   */
  on: (
    condition: Condition<S>,
    style: CSSProperties,
  ) => EnhanceStyleFn<CSSProperties>;

  /**
   * Combines a list of conditions into a single condition which is true when
   * all of the specified conditions are true.
   *
   * @typeParam C - The type of the conditions which must all be true in order
   * for the condition to be true.
   *
   * @param conditions - The conditions which must all be true in order for the
   * condition to be true.
   *
   * @returns A condition that is true when all of the specified conditions are
   * true.
   */
  and: <C extends Condition<S>[]>(...conditions: C) => { and: C };

  /**
   * Combines a list of conditions into a single condition which is true when
   * any of the specified conditions are true.
   *
   * @typeParam C - The type of the conditions any one of which must be true in
   * order for the condition to be true.
   *
   * @param conditions - The conditions any one of which must be true in order
   * for the condition to be true.
   *
   * @returns A condition that is true when any of the specified conditions are
   * true.
   */
  or: <C extends Condition<S>[]>(...conditions: C) => { or: C };

  /**
   * Negates a condition.
   *
   * @typeParam condition - The type of the condition which must be false in
   * order for the resulting condition to be true.
   *
   * @param condition - The condition which must be false in order for the
   * resulting condition to be true.
   *
   * @returns A condition that is true when the specified condition is false.
   */
  not: <C extends Condition<S>>(condition: C) => { not: C };

  /**
   * The style sheet required to support the configured hooks.
   */
  styleSheet: () => string;
}

/**
 * Represents the function used to define hooks and related configuration.
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g., React's `CSSProperties` type).
 *
 * @typeParam S - The type of selectors for which to create hooks.
 *
 * @param selectors - The selectors for which to create hooks.
 *
 * @returns An object containing the functions needed to support and use the
 * configured hooks.
 *
 * @public
 */
export type CreateHooksFn<CSSProperties> = <S extends Selector>(
  ...selectors: S[]
) => CreateHooksResult<S, CSSProperties>;

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
 *
 */
export function buildHooksSystem<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  CSSProperties extends { [P: string]: any } = Record<string, unknown>,
>(stringify: StringifyFn = String): CreateHooksFn<CSSProperties> {
  return (...selectors: string[]) => {
    const [space, newline] =
      // @ts-expect-error bundler expected to replace `process.env.NODE_ENV` expression
      process.env.NODE_ENV === "development" ? [" ", "\n"] : ["", ""];

    return {
      styleSheet() {
        const indent = Array(2).fill(space).join("");
        return `*${space}{${newline}${selectors
          .flatMap(selector => [
            `${indent}--${createHash(selector)}-0:${space}initial;`,
            `${indent}--${createHash(selector)}-1:${space};`,
          ])
          .join(newline)}${newline}}${newline}${selectors
          .flatMap(def => {
            if (def.startsWith("@")) {
              return [
                `${def} {`,
                `${indent}* {`,
                `${indent}${indent}--${createHash(def)}-0:${space};`,
                `${indent}${indent}--${createHash(def)}-1:${space}initial;`,
                `${indent}}`,
                "}",
              ];
            }
            return [
              `${def.replace(/&/g, "*")}${space}{`,
              `${indent}--${createHash(def)}-0:${space};`,
              `${indent}--${createHash(def)}-1:${space}initial;`,
              "}",
            ];
          })
          .join(newline)}`;
      },
      and: (...and) => ({ and }),
      or: (...or) => ({ or }),
      not: not => ({ not }),
      on(condition, conditionalStyle) {
        return fallbackStyle => {
          const style = { ...fallbackStyle };
          for (const property in conditionalStyle) {
            const conditionalValue = stringify(
              conditionalStyle[property],
              property,
            );
            if (conditionalValue === null) {
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
              conditionalValue,
              fallbackValue,
            );
            Object.assign(style, { [property]: value }, extraDecls);
          }
          return style;
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
              return [
                `var(--${createHash(condition)}-1,${space}${valTrue})${space}var(--${createHash(
                  condition,
                )}-0,${space}${valFalse})`,
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

function createHash(obj: unknown) {
  const jsonString = JSON.stringify(obj);

  let hashValue = 0;

  for (let i = 0; i < jsonString.length; i++) {
    const charCode = jsonString.charCodeAt(i);
    hashValue = (hashValue << 5) - hashValue + charCode;
    hashValue &= 0x7fffffff;
  }

  const str = hashValue.toString(36);

  return /^[0-9]/.test(str) ? `a${str}` : str;
}
