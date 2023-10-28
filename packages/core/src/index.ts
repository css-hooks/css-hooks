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
  | { or: Readonly<(HookSpec & string)[]> }; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents

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

export function buildHooksSystem<Properties = Record<string, unknown>>(
  stringify: (
    propertyName: keyof Properties,
    value: unknown,
  ) => string | null = genericStringify,
) {
  return function createHooks<HookProperties extends string | number | symbol>(
    config: Record<HookProperties, HookSpec>,
  ) {
    const stringifyImpl = (propertyName: keyof Properties, value: unknown) => {
      return typeof value === "string" && value.startsWith("var(")
        ? value
        : stringify(propertyName, value);
    };

    function forEachHook(
      obj: WithHooks<HookProperties, Properties>,
      callback: (
        key: HookProperties,
        obj: WithHooks<HookProperties, Properties>,
      ) => void,
    ) {
      return Object.entries(obj)
        .filter(([key]) => key in config)
        .forEach(([key, value]) => {
          callback(
            key as HookProperties,
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument */
            value as any,
          );
        });
    }

    function hooksImpl(
      properties: WithHooks<HookProperties, Properties>,
      fallback: (
        propertyName: keyof Properties,
      ) => string | null = propertyName =>
        stringifyImpl(propertyName, properties[propertyName]),
    ): Properties {
      forEachHook(properties, (key, hook) => {
        hooksImpl(hook, propertyName => {
          let v = stringifyImpl(
            propertyName,
            hook[propertyName as keyof typeof properties],
          );
          if (v === null) {
            v = fallback(propertyName);
          }
          if (v === null) {
            v = "unset";
          }
          return v;
        });
        for (const propertyName in hook) {
          const v1 = stringifyImpl(
            propertyName as keyof Properties,
            hook[propertyName as keyof typeof hook],
          );
          if (v1 !== null) {
            let v0: string | null = fallback(propertyName as keyof Properties);
            if (v0 === null) {
              v0 = "unset";
            }
            /* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
            properties[propertyName as keyof typeof properties] =
              `var(--${String(key)}-1, ${v1}) var(--${String(
                key,
              )}-0, ${v0})` as any;
            /* eslint-enable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
          }
        }
        delete properties[key as unknown as keyof typeof properties];
      });
      return properties as Properties;
    }

    function off(name: string) {
      return `--${name}-0:initial;--${name}-1: ;`;
    }

    function on(name: string) {
      return `--${name}-0: ;--${name}-1:initial;`;
    }

    return [
      [
        "*{",
        ...Object.keys(config).map(off),
        "}",
        ...Object.entries(config).flatMap(function render([name, spec]: [
          string,
          unknown,
        ]): string[] {
          if (!isHookSpec(spec)) {
            return [];
          }
          if (typeof spec === "object") {
            if ("or" in spec) {
              return spec.or.flatMap(x => render.bind(this)([name, x]));
            }
            return [];
          }
          if (spec.includes("&")) {
            return [`${spec.replace(/&/g, "*")}{${on(name)}}`];
          }
          if (spec.startsWith(":")) {
            return [`${spec}{${on(name)}}`];
          }
          if (spec.startsWith("@")) {
            return [`${spec}{*{${on(name)}}}`];
          }
          return [];
        }),
      ].join(""),
      function hooks(
        properties: WithHooks<HookProperties, Properties>,
      ): Properties {
        return hooksImpl(
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
