<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@css-hooks/core](./core.md) &gt; [OnFn](./core.onfn.md)

## OnFn type

Provides a way to declare conditional styles within a [Rule](./core.rule.md)<!-- -->.

**Signature:**

```typescript
export type OnFn<HookName, CSSProperties> = (
  $: ConditionalStyleFn<HookName, CSSProperties>,
  helpers: ConditionHelpers<HookName>,
) => [condition: Condition<HookName>, style: CSSProperties][];
```
**References:** [ConditionalStyleFn](./core.conditionalstylefn.md)<!-- -->, [ConditionHelpers](./core.conditionhelpers.md)<!-- -->, [Condition](./core.condition.md)

