<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@css-hooks/recommended](./recommended.md) &gt; [BreakpointsToMediaQueries](./recommended.breakpointstomediaqueries.md)

## BreakpointsToMediaQueries type

This utility type converts a list of breakpoints into a list of media queries.

**Signature:**

```typescript
export type BreakpointsToMediaQueries<Breakpoints extends string[]> =
  UnionToIntersection<
    BreakpointsToMediaQueriesImpl<Breakpoints>[number] extends infer Q
      ? StringToHook<Q>
      : never
  >;
```
**References:** [UnionToIntersection](./recommended.uniontointersection.md)<!-- -->, [BreakpointsToMediaQueriesImpl](./recommended.breakpointstomediaqueriesimpl.md)<!-- -->, [StringToHook](./recommended.stringtohook.md)

