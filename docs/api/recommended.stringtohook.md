<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@css-hooks/recommended](./recommended.md) &gt; [StringToHook](./recommended.stringtohook.md)

## StringToHook type

This utility type converts a hook implementation to an entry.

**Signature:**

```typescript
export type StringToHook<S> = S extends string ? Record<S, S> : never;
```

## Remarks

Useful for hook names that match their implementation
