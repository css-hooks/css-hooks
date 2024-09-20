---
title: Configuration
description: Define your hooks and configuration options.
order: 4
---

# Configuration

Set up your hooks using the `createHooks` function introduced in the
[Setup](../setup) guide. This function allows you to define various hooks that
can be used throughout your application.

## Basic hook setup

To set up your hooks, use the `createHooks` function as follows:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, and, or, not, styleSheet } = createHooks(
  "@media (hover: hover)",
  "@container (min-width: 320px)",
  "@supports (height: 100dvh)",
  "&:hover",
  // Add more hooks as needed.
);
```

## Selector syntax

Hooks are defined using a selector syntax based on CSS rulesets. There are two
types:

### Element selectors

Use `&` as a placeholder for the element to which the condition applies. The `&`
character must appear somewhere in the selector, e.g.

<!--prettier-ignore-start-->
```typescript
"&:hover"
```
<!--prettier-ignore-end-->

### At-rule selectors

At-rule selectors start with `@media`, `@container`, or `@supports`, followed by
a space, e.g.

<!--prettier-ignore-start-->
```typescript
"@media (min-width: 600px)"
```
<!--prettier-ignore-end-->

## Reusable conditions

If you find yourself using specific combinations of hooks frequently, you can
create reusable conditions using the `and`, `or`, and `not` functions and export
them from your `css.ts` module:

```typescript
// src/css.ts

// Combining hooks for reusable conditions
export const hoverOnly = and("@media (hover: hover)", "&:hover");
```

## Using the hooks

Now that you know how to define hooks, complete the [Setup](../setup) guide if
you haven't already, or proceed to the [Usage](../usage/index.md) guide to learn
how to use your hooks.
