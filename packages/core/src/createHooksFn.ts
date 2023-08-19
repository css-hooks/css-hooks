/* eslint-disable @typescript-eslint/no-explicit-any */
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

type KebabToCamel<S extends string> = S extends `${infer H0}${infer T0}`
  ? H0 extends "-"
    ? T0 extends `${infer H1}${infer T1}`
      ? `${Capitalize<H1>}${KebabToCamel<T1>}`
      : never
    : `${H0}${KebabToCamel<T0>}`
  : "";

export type WithHooksPublic<
  Casing extends "camel" | "kebab",
  HookProperties extends Readonly<string[]>,
  Properties,
> = WithHooks<
  Properties,
  Casing extends "camel"
    ? KebabToCamel<HookProperties[number]>
    : HookProperties[number]
>;

type WithHooks<
  Properties,
  HookProperties,
  HookPropertiesSub extends HookProperties = HookProperties,
> = Properties &
  Partial<
    UnionToIntersection<
      HookPropertiesSub extends string
        ? {
            [K in HookPropertiesSub]: WithHooks<
              Properties,
              Exclude<HookProperties, HookPropertiesSub>
            >;
          }
        : never
    >
  >;

/** @internal */
export default function createHooksFn<
  Casing extends "camel" | "kebab",
  HookTypes extends Readonly<string[]>,
  Properties,
  HookType = Casing extends "camel"
    ? KebabToCamel<HookTypes[number]>
    : HookTypes[number],
>(
  casing: Casing,
  hookTypes: HookTypes,

  /**
   * Stringifies property values
   *
   * @remarks
   * This should return `null` for values that can't be stringified.
   */
  stringifyValue: (propertyName: string, value: unknown) => string | null,
): (propertiesWithHooks: WithHooks<Properties, HookType>) => Properties {
  const stringify = (
    propertyName: string | number | symbol,
    value: unknown,
  ) => {
    if (typeof propertyName !== "string") {
      return null;
    }
    return typeof value === "string" && value.startsWith("var(")
      ? value
      : stringifyValue(propertyName, value);
  };

  const keyToHookType =
    casing === "camel"
      ? (k: string) =>
          hookTypes.find(
            ht => ht === k.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`),
          ) || null
      : (k: string) => hookTypes.find(ht => ht === k) || null;

  function forEachHook(
    obj: WithHooks<Properties, HookType>,
    callback: (
      key: string,
      hookType: HookTypes[number],
      obj: WithHooks<Properties, HookType>,
    ) => void,
  ) {
    return Object.entries(obj)
      .map(([key, value]) => [key, keyToHookType(key), value] as const)
      .filter(([, hookType]) => hookType)
      .forEach(([key, hookType, value]) =>
        callback(
          key,
          hookType as HookTypes[number],
          value as WithHooks<Properties, HookType>,
        ),
      );
  }

  return function hooks(
    properties: WithHooks<Properties, HookType>,
    fallback: (propertyName: string) => string | null = propertyName =>
      stringify(
        propertyName,
        properties[propertyName as keyof typeof properties],
      ),
  ): Properties {
    forEachHook(properties, (key, hookType, hook) => {
      hooks(hook, propertyName => {
        let v = stringify(
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
        const v1 = stringify(
          propertyName,
          hook[propertyName as keyof typeof hook],
        );
        if (v1 !== null) {
          let v0: string | null = fallback(propertyName);
          if (v0 === null) {
            v0 = "unset";
          }
          /* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
          properties[propertyName as keyof typeof properties] =
            `var(--${hookType}-1, ${v1}) var(--${hookType}-0, ${v0})` as any;
          /* eslint-enable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
        }
      }
      delete properties[key as keyof typeof properties];
    });
    return properties as Properties;
  };
}
