---
title: Configuration
description: Defining the selectors and at-rules available to your style props
order: 4
---

# Configuration

Register each selector and at-rule as a hook that your components can use with
`on()`. The generated stylesheet evaluates these hooks, while the component's
style object supplies the declarations.

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, and, or, not, consume, provide, invert, styleSheet } =
  createHooks(
    "&:hover",
    "&:focus-visible",
    "&:active",
    "@media (hover: hover)",
    "@media (prefers-color-scheme: dark)",
    "@container (min-width: 320px)",
    "@supports (height: 100dvh)",
    "@scope ([data-theme='dark']) to ([data-theme])",
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

## Compose reusable conditions

Use `and`, `or`, and `not` to create conditions from hooks or other conditions.

```typescript
export const hoverOnly = and("@media (hover: hover)", "&:hover");
export const intent = or(hoverOnly, "&:focus-visible");
```

For best results, create generic atomic hooks. A hook such as `&:hover` works on
its own and, through `and`, `or`, and `not`, combines with hooks such as
`&:focus` and `&:enabled` to express more specific conditions. The combinators
build on existing hooks, which promotes reuse and keeps the generated stylesheet
small.

## Provide conditions to descendants

Use `provide()` to evaluate a condition on one element and `consume()` to read
its state from descendant styles:

```typescript
const dark = "@media (prefers-color-scheme: dark)";
const providerStyle = provide(dark);

const descendantStyle = pipe(
  { color: "black" },
  on(consume(dark), { color: "white" }),
);
```

Use one of five slots, numbered `0` through `4`, when descendants need to invert
the provided state. The provider and each inversion layer must use the same
slot:

```typescript
const providerStyle = provide(0, dark);
const invertedStyle = invert(0, dark);
```

Each inversion persists for all descendants until another inversion of the same
slot and condition reverses it again. Independent contexts on the same ancestry
path must use different slots. Slots can be reused safely in separate DOM
branches. Hook systems configured with the same hooks share slot ownership. Do
not apply a slot-backed provider to the document element; container style
queries only apply styles to descendants, and Safari cannot use the document
element as a style query container.

Continue to [Usage](../usage/index.md) to apply these conditions with override
styles.
