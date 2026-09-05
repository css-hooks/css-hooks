---
title: Configuration
description: Define the selectors and at-rules available to your style props.
order: 4
---

# Configuration

Register each selector and at-rule that your components will use with `on()`.
The generated stylesheet evaluates these conditions, while the component's style
object supplies the declarations.

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, and, or, not, styleSheet } = createHooks(
  "&:hover",
  "&:focus-visible",
  "&:active",
  "@media (hover: hover)",
  "@container (min-width: 320px)",
  "@supports (height: 100dvh)",
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

Hooks support `@media`, `@container`, `@supports`, and `@starting-style`.

<!--prettier-ignore-start-->
```typescript
"@media (min-width: 600px)"
"@container (min-width: 320px)"
"@supports (height: 100dvh)"
"@starting-style"
```
<!--prettier-ignore-end-->

## Compose reusable conditions

Use `and`, `or`, and `not` to create named conditions from registered hooks.

```typescript
export const hoverOnly = and("@media (hover: hover)", "&:hover");
export const intent = or(hoverOnly, "&:focus-visible");
```

For best results, define generic, atomic hooks and register each one. A hook
such as `&:hover` works on its own and, through `and`, `or`, and `not`, combines
with hooks such as `&:focus` and `&:enabled` to express more specific
conditions. The combinators build on hooks you have already registered, which
promotes reuse and keeps the generated stylesheet small.

Continue to [Usage](../usage/index.md) to apply these conditions as override
styles.
