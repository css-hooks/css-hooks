---
title: Configuration
description:
  Defining the selectors, at-rules, and flags available to your style props
order: 4
---

# Configuration

Register each selector, at-rule, and flag that your components will use by
passing it to `createHooks()`. The generated stylesheet evaluates these
conditions, while the component's style object supplies the declarations.

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, and, or, not, enable, disable, styleSheet } = createHooks(
  "&:hover",
  "&:focus-visible",
  "&:active",
  "@media (hover: hover)",
  "@container (min-width: 320px)",
  "@supports (height: 100dvh)",
  "@scope ([data-theme='dark']) to ([data-theme])",
  "flag:dark",
);
```

## CSS selectors

Use `&` as a placeholder for the current element, i.e. the element whose style
object the hook filters. A selector must target that element, whether it
describes the element's own state or its surrounding context.

<!--prettier-ignore-start-->
```typescript
"&:hover" // The element is hovered.
".group:hover &" // The element is inside a hovered .group.
":checked + &" // The element follows a checked input.
```
<!--prettier-ignore-end-->

## At-rules

Hooks support `@media`, `@container`, `@supports`, `@scope`, and
`@starting-style`.

<!--prettier-ignore-start-->
```typescript
"@media (min-width: 600px)"
"@container (min-width: 320px)"
"@supports (height: 100dvh)"
"@scope ([data-theme='dark']) to ([data-theme])"
"@starting-style"
```
<!--prettier-ignore-end-->

`@scope` hooks require an explicit scope root. They apply to the root and its
scoped descendants, excluding any scope limit and its descendants.

## Flags

Register a `flag:<name>` hook to condition styles on inherited boolean state.
Registered flags are disabled by default. Use `enable()` or `disable()` with the
short flag name to set the state for an element's descendants:

```tsx
const darkStyle = enable("dark");

const panelStyle = pipe(
  { background: "#fff", color: "#000" },
  on("flag:dark", { background: "#000", color: "#fff" }),
);
```

A nested setter overrides the inherited state for its subtree:

```tsx
<main style={enable("dark")}>
  <section style={disable("dark")}>{/* Light subtree */}</section>
</main>
```

The element carrying `enable()` or `disable()` still observes the state from its
nearest ancestor. Only its descendants observe the newly assigned state. This
also makes it possible to invert a flag without creating a custom-property
cycle:

```typescript
const invertDark = pipe(enable("dark"), on("flag:dark", disable("dark")));
```

`createHooks()` only returns `enable()` and `disable()` when at least one flag
is registered. Their arguments are restricted to the short names of the flags
from that call.

## Compose reusable conditions

Use `and`, `or`, and `not` to create conditions from other conditions/hooks.

```typescript
export const hoverOnly = and("@media (hover: hover)", "&:hover");
export const intent = or(hoverOnly, "&:focus-visible");
```

For best results, create generic atomic hooks. A hook such as `&:hover` works on
its own and, through `and`, `or`, and `not`, combines with hooks such as
`&:focus` and `&:enabled` to express more specific conditions. The combinators
build on existing hooks, which promotes reuse and keeps the generated stylesheet
small.

Continue to [Usage](../usage/index.md) to apply these conditions with override
styles.
