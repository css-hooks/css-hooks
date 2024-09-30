<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@css-hooks/core](./core.md) &gt; [Selector](./core.selector.md)

## Selector type

Represents the selector logic used to create a hook.

**Signature:**

```typescript
export type Selector = `${string}&${string}` | `@${"media" | "container" | "supports"} ${string}`;
```

## Remarks

Two types are supported: 1. A basic selector, where `&` is used as a placeholder for the element to which the condition applies. The `&` character must appear somewhere. 2. A `@media`<!-- -->, `@container`<!-- -->, or `@supports` at-rule. The value must begin with one of these keywords, followed by a space.
