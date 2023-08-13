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
    HookTypes extends Readonly<string[]>
  >(
    casing: Casing,

    /**
     * Stringifies property values
     *
     * @remarks
     * This should return `null` for values that can't be stringified.
     */
    stringifyValue: (propertyName: string, value: unknown) => string | null,
    hookTypes: HookTypes
  ) => {
    const stringify: typeof stringifyValue = (propertyName, value) =>
      typeof value === "string" && value.startsWith("var(")
        ? value
        : stringifyValue(propertyName, value);

    type HookType = HookTypes[number];
    return (
      properties: Properties &
        Partial<
          Record<
            Casing extends "camel" ? KebabToCamel<HookType> : HookType,
            Partial<Properties>
          >
        >
    ): Properties => {
      const normalizeKey =
        casing === "camel"
          ? (k: string) => k.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`)
          : (k: string) => k;

      const o = JSON.parse(JSON.stringify(properties)) as typeof properties;
      for (const k in o) {
        const key = normalizeKey(k);
        if (hookTypes.some((x) => x.toString() === key)) {
          const hookType = key;
          for (const p in o[k as keyof typeof o]) {
            const h = o[k as keyof typeof o];
            const v1 = h ? stringify(p, h[p as keyof Properties]) : null;
            if (v1 === null) {
              continue;
            }
            const v0 = p in o ? stringify(p, o[p]) : "initial";
            /* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
            o[p as keyof typeof o] =
              `var(--${hookType}-1, ${v1}) var(--${hookType}-0, ${
                v0 === null ? "initial" : v0
              })` as any;
            /* eslint-enable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
          }
          delete o[k as keyof typeof o];
        }
      }

      return o;
    };
  };
}
