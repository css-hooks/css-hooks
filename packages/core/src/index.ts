/* eslint-disable @typescript-eslint/no-explicit-any */
type UnionToIntersection<T> = (T extends any ? (t: T) => any : never) extends (
  t: infer U,
) => any
  ? U
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

type HookSpec =
  | `@${"media" | "container"} ${string}`
  | `:${string}`
  | `${string}&${string}`
  | { or: Readonly<HookSpec[]> }
  | { and: Readonly<HookSpec[]> };

function isHookSpec(x: unknown): x is HookSpec {
  if (!x) {
    return false;
  }
  if (typeof x === "string") {
    return (
      x.startsWith(":") ||
      x.startsWith("@media ") ||
      x.startsWith("@container ") ||
      x.includes("&")
    );
  }
  if (typeof x === "object") {
    if ("or" in x && x.or instanceof Array) {
      return !x.or.some(xx => !isHookSpec(xx));
    }
    if ("and" in x && x.and instanceof Array) {
      return !x.and.some(xx => !isHookSpec(xx));
    }
  }
  return false;
}

export type WithHooks<HookProperties, Properties> = WithHooksImpl<
  Properties,
  HookProperties
>;

type WithHooksImpl<
  Properties,
  HookProperties,
  HookPropertiesSub extends HookProperties = HookProperties,
> = Properties &
  Partial<
    UnionToIntersection<
      HookPropertiesSub extends string
        ? {
            [K in HookPropertiesSub]: WithHooksImpl<
              Properties,
              Exclude<HookProperties, HookPropertiesSub>
            >;
          }
        : never
    >
  >;

/** @internal */
export function genericStringify(_: unknown, value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return null;
}

function hash(obj: unknown): string {
  const jsonString = JSON.stringify(obj);

  let hashValue = 0;

  for (let i = 0; i < jsonString.length; i++) {
    const charCode = jsonString.charCodeAt(i);
    hashValue = (hashValue << 5) - hashValue + charCode;
    hashValue &= 0x7fffffff;
  }

  return hashValue.toString(36);
}

export function buildHooksSystem<Properties = Record<string, unknown>>(
  stringify: (
    propertyName: keyof Properties,
    value: unknown,
  ) => string | null = genericStringify,
) {
  return function createHooks<HookProperties extends string>(
    config: Record<HookProperties, HookSpec>,
    options?:
      | { debug?: boolean; /** @internal */ hookNameToId?: undefined }
      | {
          debug?: undefined;
          /** @internal */ hookNameToId?: (hookName: string) => string;
        },
  ) {
    const stringifyImpl = (propertyName: keyof Properties, value: unknown) => {
      return typeof value === "string" && value.startsWith("var(")
        ? value
        : stringify(propertyName, value);
    };

    const hookId =
      options?.hookNameToId ||
      ((hookName: HookProperties) => {
        const specHash = hash(config[hookName]);
        return options?.debug
          ? `${hookName.replace(/[^A-Za-z0-9-]/g, "_")}-${specHash}`
          : specHash;
      });

    function forEachHook(
      properties: WithHooks<HookProperties, Properties>,
      callback: (
        hookName: HookProperties,
        innerProperties: WithHooks<HookProperties, Properties>,
      ) => void,
    ) {
      return Object.entries(properties)
        .filter(([key]) => key in config)
        .forEach(([hookName, value]) => {
          callback(
            hookName as HookProperties,
            value as WithHooks<HookProperties, Properties>,
          );
        });
    }

    const hooks = Object.entries(config)
      .map(([name, definition]: [string, unknown]): [string, unknown] => {
        function nest(input: HookSpec): HookSpec {
          if (typeof input === "object") {
            if ("and" in input) {
              if (input.and.length > 2) {
                const [left, ...rest] = input.and as [HookSpec];
                return { and: [left, nest({ and: rest })] };
              }
              return {
                and: input.and.map(item =>
                  typeof item === "string" ? item : nest(item),
                ),
              };
            }

            if ("or" in input) {
              if (input.or.length > 2) {
                const [left, ...rest] = input.or as [HookSpec];
                return { or: [left, nest({ or: rest })] };
              }
              return {
                or: input.or.map(item =>
                  typeof item === "string" ? item : nest(item),
                ),
              };
            }
          }

          return input;
        }

        if (!isHookSpec(definition) || typeof definition !== "object") {
          return [name, definition];
        }

        return [name, nest(definition)];
      })
      .flatMap(([name, definition]: [string, unknown]) =>
        (function hooksCSS(
          name: string,
          definition: unknown,
        ): {
          init: string;
          rule?: string;
        }[] {
          if (!isHookSpec(definition)) {
            return [];
          }
          if (typeof definition === "object") {
            let a: HookSpec | undefined,
              operator,
              b: HookSpec | undefined,
              extraHooksCSS: ReturnType<typeof hooksCSS> = [];
            if ("or" in definition) {
              operator = "or";
              [a, b] = definition.or;
              if (!a) {
                return [];
              }
              if (!b) {
                return hooksCSS(name, a);
              }
              extraHooksCSS = [
                {
                  init: (function aorb(x) {
                    const a = `${x}A`;
                    const b = `${x}B`;
                    return [
                      `--${x}-0:var(--${a}-0,var(--${b}-0));`,
                      `--${x}-1:var(--${a}-1) var(--${b}-1);`,
                    ].join("");
                  })(name),
                },
              ];
            } else if ("and" in definition) {
              operator = "and";
              [a, b] = definition.and;
              if (!a) {
                return [];
              }
              if (!b) {
                return hooksCSS(name, a);
              }
              extraHooksCSS = [
                {
                  init: (function aandb(x) {
                    const a = `${x}A`;
                    const b = `${x}B`;
                    return [
                      `--${x}-0:var(--${a}-0) var(--${b}-0);`,
                      `--${x}-1:var(--${a}-1,var(--${b}-1));`,
                    ].join("");
                  })(name),
                },
              ];
            }
            if (operator) {
              return [
                ...hooksCSS(`${name}A`, a),
                ...hooksCSS(`${name}B`, b),
                ...extraHooksCSS,
              ];
            }
          }

          const init = `--${name}-0:initial;--${name}-1: ;`;
          let rule;

          if (typeof definition === "string") {
            if (definition.includes("&")) {
              rule = `${definition.replace(
                /&/g,
                "*",
              )}{--${name}-0: ;--${name}-1:initial;}`;
            } else if (definition.startsWith(":")) {
              rule = `${definition}{--${name}-0: ;--${name}-1:initial;}`;
            } else if (definition.startsWith("@")) {
              rule = `${definition}{*{--${name}-0: ;--${name}-1:initial;}}`;
            }
          }

          return rule === undefined ? [] : [{ init, rule }];
        })(hookId(name as Parameters<typeof hookId>[0]), definition),
      )
      .reduce(
        (acc, { init = "", rule = "" }) => ({
          init: acc.init + init,
          rule: acc.rule + rule,
        }),
        {
          init: "",
          rule: "",
        },
      );

    function cssImpl(
      properties: WithHooks<HookProperties, Properties>,
      fallback: (
        propertyName: keyof Properties,
      ) => string | null = propertyName =>
        stringifyImpl(propertyName, properties[propertyName]),
    ): Properties {
      forEachHook(properties, (hookName, innerProperties) => {
        cssImpl(innerProperties, propertyName => {
          let v = stringifyImpl(
            propertyName,
            innerProperties[propertyName as keyof typeof innerProperties],
          );
          if (v === null) {
            v = fallback(propertyName);
          }
          if (v === null) {
            v = "unset";
          }
          return v;
        });
        for (const propertyName in innerProperties) {
          const v1 = stringifyImpl(
            propertyName as keyof Properties,
            innerProperties[propertyName as keyof typeof innerProperties],
          );
          if (v1 !== null) {
            let v0: string | null = fallback(propertyName as keyof Properties);
            if (v0 === null) {
              v0 = "unset";
            }
            /* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
            properties[propertyName as keyof typeof properties] =
              `var(--${hookId(hookName)}-1, ${v1}) var(--${hookId(
                hookName,
              )}-0, ${v0})` as any;
            /* eslint-enable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
          }
        }
        delete properties[hookName as unknown as keyof typeof properties];
      });
      return properties as Properties;
    }

    return [
      `*{${hooks.init}}${hooks.rule}`,
      function css(
        properties: WithHooks<HookProperties, Properties>,
      ): Properties {
        return cssImpl(
          JSON.parse(JSON.stringify(properties)) as typeof properties,
        );
      },
    ] as const;
  };
}

/**
 * A list of hooks offered as a "sensible default" to solve the most common use cases.
 */
export const recommended = {
  active: ":active",
  autofill: { or: [":autofill", ":-webkit-autofill"] },
  checked: ":checked",
  default: ":default",
  disabled: ":disabled",
  empty: ":empty",
  enabled: ":enabled",
  evenChild: ":nth-child(even)",
  firstChild: ":first-child",
  firstOfType: ":first-of-type",
  focus: ":focus",
  focusVisible: ":focus-visible",
  focusWithin: ":focus-within",
  hover: ":hover",
  inRange: ":in-range",
  indeterminate: ":indeterminate",
  invalid: ":invalid",
  lastChild: ":last-child",
  lastOfType: ":last-of-type",
  oddChild: ":nth-child(odd)",
  onlyChild: ":only-child",
  onlyOfType: ":only-of-type",
  outOfRange: ":out-of-range",
  placeholderShown: { or: [":placeholder-shown", ":-moz-placeholder-shown"] },
  readOnly: { or: [":read-only", ":-moz-read-only"] },
  readWrite: { or: [":read-write", ":-moz-read-write"] },
  required: ":required",
  target: ":target",
  valid: ":valid",
  visited: ":visited",
} as const;
