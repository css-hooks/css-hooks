type KebabToCamel<S extends string> = S extends `${infer H0}${infer T0}`
  ? H0 extends "-"
    ? T0 extends `${infer H1}${infer T1}`
      ? `${Capitalize<H1>}${KebabToCamel<T1>}`
      : never
    : `${H0}${KebabToCamel<T0>}`
  : "";

/** @internal */
export default function createHooksFn<Properties>() {
  return <
    Casing extends "camel" | "kebab",
    HookTypes extends Readonly<string[]>,
  >(
    casing: Casing,

    /**
     * Stringifies property values
     *
     * @remarks
     * This should return `null` for values that can't be stringified.
     */
    stringifyValue: (propertyName: string, value: unknown) => string | null,
    hookTypes: HookTypes,
  ) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    type UnionToIntersection<T> = (
      T extends any ? (x: T) => any : never
    ) extends (x: infer R) => any
      ? R
      : never;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    type PropertiesWithHooks<
      A extends string = Casing extends "camel"
        ? KebabToCamel<HookTypes[number]>
        : HookTypes[number],
      B extends A = A,
    > = Partial<
      Properties &
        UnionToIntersection<
          B extends infer T
            ? T extends string
              ? Record<B, PropertiesWithHooks<Exclude<A, B>>>
              : never
            : never
        >
    >;

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
      obj: PropertiesWithHooks,
      callback: (
        key: string,
        hookType: HookTypes[number],
        obj: PropertiesWithHooks,
      ) => void,
    ) {
      return Object.entries(obj)
        .map(([key, value]) => [key, keyToHookType(key), value] as const)
        .filter(([, hookType]) => hookType)
        .forEach(([key, hookType, value]) =>
          callback(
            key,
            hookType as HookTypes[number],
            value as PropertiesWithHooks,
          ),
        );
    }

    function hooks(
      properties: PropertiesWithHooks,
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
    }

    return (properties: PropertiesWithHooks) => hooks(properties);
  };
}
