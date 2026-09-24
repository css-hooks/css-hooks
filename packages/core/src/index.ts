/**
 * CSS Hooks core library
 *
 * @packageDocumentation
 */

/**
 * Represents the conditions under which a given hook or declaration applies.
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
 * Represents a hook registered with `createHooks`.
 *
 * @remarks
 * Four forms are supported:
 *
 * 1. A selector hook, where `&` is used as a placeholder for the element to which
 *    the condition applies. The `&` character must appear somewhere.
 * 2. An at-rule hook beginning with `@media`, `@container`, `@supports`, or
 *    `@scope`, followed by a space. `@scope` requires an explicit scope root.
 * 3. The `@starting-style` at-rule hook with no additional parameters.
 * 4. A named boolean flag hook beginning with `flag:`.
 *
 * @public
 */
export type Hook =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`
  | `@scope (${string})`
  | "@starting-style"
  | `flag:${string}`;

/** Named boolean state inherited by an element's descendants. */
type Flag = Extract<Hook, `flag:${string}`>;

/** Whether a type contains more than one possible member. */
type IsUnion<T, Whole = T> = T extends Whole
  ? [Whole] extends [T]
    ? false
    : true
  : never;

/** Extracts the short names guaranteed to be flags in a hook tuple. */
type FlagName<Hooks extends readonly Hook[]> =
  true extends IsUnion<Hooks>
    ? never
    : Hooks extends readonly [
          infer Head extends Hook,
          ...infer Tail extends Hook[],
        ]
      ? true extends IsUnion<Head>
        ? FlagName<Tail>
        : [Head] extends [Flag]
          ? Head extends `flag:${infer Name}`
            ? Name | FlagName<Tail>
            : never
          : FlagName<Tail>
      : never;

/** Style declarations that set an inherited flag for descendants. */
type FlagStyle = { [P in `--${string}`]: string };

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
 * @typeParam Hooks - The tuple of configured hooks
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 *
 * @public
 */
export type CreateHooksResult<
  Hooks extends readonly Hook[],
  CSSProperties,
  CSSPropertyConflicts extends object,
> = {
  /**
   * Creates a function that enhances a style object with conditional override
   * styles.
   */
  on: <
    OverrideCSSProperties extends CSSProperties,
    BaseCSSProperties extends CSSProperties,
  >(
    condition: Condition<Hooks[number]>,
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
  and: <C extends Condition<Hooks[number]>[]>(...conditions: C) => { and: C };

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
  or: <C extends Condition<Hooks[number]>[]>(...conditions: C) => { or: C };

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
  not: <C extends Condition<Hooks[number]>>(condition: C) => { not: C };

  /** Returns the style sheet required to support the configured hooks. */
  styleSheet: () => string;
} & ([FlagName<Hooks>] extends [never]
  ? unknown
  : {
      /** Returns style declarations that enable a flag for descendants. */
      enable: (flag: FlagName<Hooks>) => FlagStyle;

      /** Returns style declarations that disable a flag for descendants. */
      disable: (flag: FlagName<Hooks>) => FlagStyle;
    });

/**
 * Represents the function used to define hooks and related configuration.
 *
 * @remarks
 * When the registered hooks are known to include one or more `flag:<name>`
 * values, the return type also exposes `enable()` and `disable()` functions
 * restricted to their short names.
 *
 * @typeParam CSSProperties - The type of a style object, typically defined by
 *   an app framework (e.g., React's `CSSProperties` type)
 * @typeParam CSSPropertyConflicts - A map from CSS properties to the properties
 *   with which they conflict
 * @typeParam Hooks - The tuple of hooks to create
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
> = <const Hooks extends Hook[]>(
  ...hooks: Hooks
) => CreateHooksResult<Hooks, CSSProperties, CSSPropertyConflicts>;

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
  return <const Hooks extends Hook[]>(...hooks: Hooks) => {
    type H = Hooks[number];
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
    const flags = new Map(
      hooks.flatMap(hook =>
        hook.startsWith("flag:") ? [[hook.slice(5), hook] as const] : [],
      ),
    );

    const flagDeclarations = (flag: string, enabled: boolean) => {
      const hook = flags.get(flag);
      if (!hook) {
        throw new RangeError(`Unknown flag: ${flag}`);
      }
      const hash = hookHashes.get(hook);
      return {
        [`--${hash}f`]: enabled ? "on" : "off",
      } as FlagStyle;
    };

    return {
      enable: (flag: string) => flagDeclarations(flag, true),
      disable: (flag: string) => flagDeclarations(flag, false),
      styleSheet() {
        type Ruleset = [string[], { [P: string]: string } | Ruleset];
        return hooks
          .flatMap(hook => {
            const hookHash = hookHashes.get(hook);
            const offVariable = `--${hookHash}0`;
            const onVariable = `--${hookHash}1`;
            const offDeclarations = {
              [offVariable]: "initial",
              [onVariable]: space,
            };
            const onDeclarations = {
              [offVariable]: space,
              [onVariable]: "initial",
            };
            if (hook.startsWith("flag:")) {
              const flagVariable = `--${hookHash}f`;
              return [
                [
                  [`@property ${flagVariable}`],
                  {
                    syntax: '"<custom-ident>"',
                    inherits: "true",
                    "initial-value": "off",
                  },
                ] satisfies Ruleset,
                [[":root"], { [flagVariable]: "off" }] satisfies Ruleset,
                [["*"], offDeclarations] satisfies Ruleset,
                [
                  [`@container style(${flagVariable}:${space}on)`],
                  [["*"], onDeclarations],
                ] satisfies Ruleset,
              ];
            }
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
              const hookHash =
                hookHashes.get(condition as H) || createHash(condition);
              return [
                `var(--${hookHash}1,${space}${valTrue})${space}var(--${hookHash}0,${space}${valFalse})`,
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
    } as CreateHooksResult<Hooks, CSSProperties, CSSPropertyConflicts>;
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
