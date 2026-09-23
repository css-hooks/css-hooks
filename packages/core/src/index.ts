/**
 * CSS Hooks core library
 *
 * @packageDocumentation
 */

/**
 * Boolean condition expression composed from registered hooks
 *
 * @typeParam H - The type of registered hook from which to build conditions
 *
 * @public
 */
export type Condition<H> =
  | H
  | { and: Condition<H>[] }
  | { or: Condition<H>[] }
  | { not: Condition<H> }
  | { consume: Condition<H> };

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
 * Atomic selector or at-rule registered as a CSS hook
 *
 * @remarks
 * Three forms are supported:
 *
 * 1. A basic selector, where `&` is used as a placeholder for the element to which
 *    the condition applies. The `&` character must appear somewhere.
 * 2. `@media`, `@container`, `@supports`, and `@scope` at-rules. Each value must
 *    begin with its keyword, followed by a space. `@scope` requires an explicit
 *    scope root.
 * 3. `@starting-style` with no additional parameters
 *
 * @public
 */
export type Hook =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`
  | `@scope (${string})`
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

/** Preserves a style's shape while rejecting known-present conflicts. */
type CSSPropertiesWithoutConflicts<
  CSSProperties,
  CSSPropertyConflicts extends object,
  OverrideCSSProperties,
> = {
  [P in keyof CSSProperties]: P extends CSSPropertyConflictKeys<
    CSSPropertyConflicts,
    OverrideCSSProperties
  >
    ? Pick<CSSProperties, P> extends Required<Pick<CSSProperties, P>>
      ? never
      : CSSProperties[P]
    : CSSProperties[P];
};

/**
 * An object containing the functions needed to support and use the configured
 * hooks
 *
 * @typeParam H - The type of the configured hooks
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 *
 * @public
 */
export interface CreateHooksResult<
  H,
  CSSProperties,
  CSSPropertyConflicts extends object,
> {
  /**
   * Creates a function that enhances a style object with conditional override
   * styles.
   */
  on: <
    OverrideCSSProperties extends CSSProperties,
    BaseCSSProperties extends CSSProperties,
  >(
    condition: Condition<H>,
    overrideStyle: OverrideCSSProperties,
  ) => (
    style: CSSProperties &
      CSSPropertiesWithoutConflicts<
        BaseCSSProperties,
        CSSPropertyConflicts,
        OverrideCSSProperties
      >,
  ) => Omit<BaseCSSProperties, keyof OverrideCSSProperties> &
    OverrideCSSProperties;

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
  and: <C extends Condition<H>[]>(...conditions: C) => { and: C };

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
  or: <C extends Condition<H>[]>(...conditions: C) => { or: C };

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
  not: <C extends Condition<H>>(condition: C) => { not: C };

  /**
   * Creates a condition that reads the state exposed by a provider.
   *
   * @remarks
   * The returned condition reads the state of `condition` from the nearest
   * ancestor whose style includes the declarations returned by
   * {@link CreateHooksResult.provide}. It does not evaluate `condition` against
   * the consuming element.
   *
   * @typeParam C - The type of the condition whose provided state is consumed
   *
   * @param condition - The condition whose provided state is consumed
   *
   * @returns A condition that reflects the state exposed by the nearest
   *   provider
   */
  consume: <C extends Condition<H>>(condition: C) => { consume: C };

  /**
   * Creates style declarations that expose a condition's state to descendants.
   *
   * @remarks
   * Apply the returned declarations to an element's style. The condition is
   * evaluated against that element and can be read by descendant styles using
   * {@link CreateHooksResult.consume}. A nested provider for the same condition
   * overrides the state inherited from an outer provider.
   *
   * @param condition - The condition whose state is exposed to descendants
   *
   * @returns Style declarations to apply to the provider element
   */
  provide: (condition: Condition<H>) => { [P in `--${string}`]: string };

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
 * @typeParam H - The type of hooks to create
 *
 * @param hooks - The hooks to create
 *
 * @returns An object containing the functions needed to support and use the
 *   configured hooks
 *
 * @public
 */
export type CreateHooksFn<
  CSSProperties,
  CSSPropertyConflicts extends object = object,
> = <H extends Hook>(
  ...hooks: H[]
) => CreateHooksResult<H, CSSProperties, CSSPropertyConflicts>;

/**
 * Merges an override style prop into a base style.
 *
 * @remarks
 * Override properties are moved to the end of the resulting object so their
 * declaration order takes precedence over properties in the base style.
 *
 * @typeParam OverrideStyle - The type of the override style prop
 *
 * @param overrideStyle - The style whose properties should take precedence
 *
 * @returns A curried function that merges `overrideStyle` with a base style
 *
 * @public
 */
export function mergeStyles<const OverrideStyle extends object>(
  overrideStyle: OverrideStyle | null | undefined,
): <Style extends object>(
  style: Style,
) => Omit<Style, keyof OverrideStyle> & OverrideStyle {
  return <Style extends object>(style: Style) => {
    if (!overrideStyle) {
      return style as unknown as Omit<Style, keyof OverrideStyle> &
        OverrideStyle;
    }

    const result = { ...style };
    for (const property of Reflect.ownKeys(overrideStyle)) {
      if (Object.prototype.propertyIsEnumerable.call(overrideStyle, property)) {
        Reflect.deleteProperty(result, property);
      }
    }
    return Object.assign(result, overrideStyle) as Omit<
      Style,
      keyof OverrideStyle
    > &
      OverrideStyle;
  };
}

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
  return (...hooks: string[]) => {
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

    const hookHashes = new Map(hooks.map(hook => [hook, createHash(hook)]));

    const hookHash = (hook: string) => hookHashes.get(hook) || createHash(hook);

    const conditionHash = (condition: Condition<string>) =>
      (typeof condition === "string" ? hookHash(condition) : undefined) ||
      createHash(condition);

    type VariableOptions = { namespace?: string };

    const conditionVariable = (
      condition: Condition<string>,
      state: 0 | 1,
      { namespace = "" }: VariableOptions = {},
    ) =>
      `--${namespace}${namespace ? "-" : ""}${conditionHash(condition)}${state}`;

    const toggleExpression = (
      condition: Condition<string>,
      valueIfFalse: string,
      valueIfTrue: string,
      options?: VariableOptions,
    ) =>
      `var(${conditionVariable(condition, 0, options)},${space}${valueIfFalse})${space}var(${conditionVariable(condition, 1, options)},${space}${valueIfTrue})`;

    const toggleDeclarations = (
      condition: Condition<string>,
      falseState: string,
      trueState: string,
      options?: VariableOptions,
    ) => ({
      [conditionVariable(condition, 0, options)]: falseState,
      [conditionVariable(condition, 1, options)]: trueState,
    });

    function buildExpression(
      condition: Condition<string>,
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
        return [toggleExpression(condition, valFalse, valTrue), extraDecls];
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
        const [expr, decls] = buildExpression(head, tailExpr, valueIfFalse);
        return [expr, { ...decls, ...tailDecls }];
      }
      if ("or" in condition) {
        return buildExpression(
          { and: condition.or.map(not => ({ not })) },
          valueIfFalse,
          valueIfTrue,
        );
      }
      if ("not" in condition) {
        return buildExpression(condition.not, valueIfFalse, valueIfTrue);
      }
      if ("consume" in condition) {
        return [
          toggleExpression(condition.consume, valueIfFalse, valueIfTrue, {
            namespace: "ctx",
          }),
          {},
        ];
      }
      throw new Error(`Invalid condition: ${JSON.stringify(condition)}`);
    }

    return {
      styleSheet() {
        type Ruleset = [string[], { [P: string]: string } | Ruleset];
        return hooks
          .flatMap(hook => {
            const rulesets: Ruleset[] = [
              [["*"], toggleDeclarations(hook, "initial", space)],
            ];

            const onDeclarations = toggleDeclarations(hook, space, "initial");
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
          .map(
            unary(function render(ruleset: Ruleset, level: number = 0): string {
              const [selectors, declarations] = ruleset;
              const indent = Array(level * 2)
                .fill(space)
                .join("");
              if (Array.isArray(declarations)) {
                return `${indent}${selectors.join(`,${space}`)}${space}{${newline}${render(
                  declarations,
                  level + 1,
                )}${newline}${indent}}`;
              }
              return `${indent}${selectors.join(`,${space}`)}${space}{${newline}${Object.entries(
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
      consume: consume => ({ consume }),
      provide: condition => {
        const invalidVariable = `--ctx-invalid-${conditionHash(condition)}`;
        const invalidValue = `var(${invalidVariable})`;
        const [offValue, offDecls] = buildExpression(
          condition,
          space,
          invalidValue,
        );
        const [onValue, onDecls] = buildExpression(
          condition,
          invalidValue,
          space,
        );
        return {
          ...offDecls,
          ...onDecls,
          [invalidVariable]: "initial",
          ...toggleDeclarations(condition, offValue, onValue, {
            namespace: "ctx",
          }),
        };
      },
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
        };
      },
    };
  };
}

const hashAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-_";
const hashAlphabetLength = hashAlphabet.length;

function createHash(value: string | object) {
  const strValue = typeof value === "string" ? value : JSON.stringify(value);

  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;

  for (let i = 0; i < strValue.length; i++) {
    const code = strValue.charCodeAt(i);
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
