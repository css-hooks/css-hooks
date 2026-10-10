---
title: Hooks and conditions
description: Defining and combining the conditions available to your style props
order: 3
---

# Hooks and conditions

A **hook** describes a CSS state that can be used to filter declarations in an
element's style object so that they apply conditionally. Hooks work
independently, but they can also serve as building blocks for more advanced
conditions. This guide explains how to declare selector, at-rule, and flag hooks
and combine them into reusable conditions.

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, and, or, not, styleSheet } = createHooks(
  "&:hover",
  "&.a",
  "@media (hover: hover)",
  "@container (min-width: 400px)",
  "@scope ([data-theme='dark']) to ([data-theme])",
  "@supports (height: 100dvh)",
  "%dark",
);
```

`createHooks()` returns the `styleSheet` function, which constructs the plumbing
stylesheet that supports the declared hooks. It also returns the `and`, `or`,
and `not` combinators, which combine hooks into conditions. The returned `on`
function associates style declarations with hooks and conditions; the
[Applying styles](../applying-styles/index.md) guide covers its use.

## Selector hooks

A selector hook activates when the element matches its selector logic. Use
selector hooks for the element's state, reusable class markers, relationships
with ancestors or siblings, and other surrounding context. The `&` character
represents the styled element. Every selector hook must include it.

<!--prettier-ignore-start-->
```typescript
"&:hover" // The element is hovered.
"&.a" // The element has the reusable class marker "a".
".group:hover &" // The element is inside a hovered .group.
":checked + &" // The element follows a checked input.
```
<!--prettier-ignore-end-->

## At-rule hooks

An at-rule hook activates based on criteria beyond the element's selector, such
as the browsing environment, a container's size or style, or the element's own
state. CSS Hooks supports these at-rules:

- `@media` responds to the viewport, input devices, and user preferences.
- `@container` responds to the size or styles of a containing element.
- `@supports` checks whether the browser supports a CSS feature.
- `@scope` limits a condition to a section of the document tree.
- `@starting-style` defines an element's starting styles when it first renders
  or changes from `display: none` to a rendered state.

<!--prettier-ignore-start-->
```typescript
"@media (prefers-reduced-motion: reduce)" // The user requests reduced motion.
"@container (min-width: 400px)" // The container is at least 400px wide.
"@supports (height: 100dvh)" // The browser supports the dvh unit.
"@scope ([data-theme='dark']) to ([data-theme])" // Within a dark-themed donut scope
"@starting-style" // The element's first rendered styles
```
<!--prettier-ignore-end-->

When an `@scope` hook includes a scope limit, it forms a donut scope. It
activates for the scope root and its descendants, excluding the limit and its
descendants.

## Flag hooks

A flag hook activates when its inherited Boolean state is enabled. Use flags
when an entire subtree must respond to shared state, such as a color mode,
display density, or a parent's interaction state. Flags rely on property
inheritance, so descendants can respond without receiving presentational state
through component props or framework context.

Declare a flag as `%<name>`. Each flag is disabled by default. See
[Flags](../flags/index.md) to learn how to set, override, and invert flag state.

## Conditions

The `on` function accepts a hook or a condition. A **condition** combines hooks
and other conditions using the `and`, `or`, and `not` combinators.

A single hook covers one criterion, while a condition can express more specific
criteria without enlarging the plumbing stylesheet or cluttering autocomplete
suggestions with use-case-specific hooks. A hover style, for example, may
require both a device that can hover and a hovered element:

```typescript
export const hoverOnly = and("@media (hover: hover)", "&:hover");
```

The `hoverOnly` condition activates only when the media query and the `:hover`
pseudo-class both match.

For best results, keep hooks small and generic so they compose. Export reusable
conditions such as `hoverOnly` from your styling module.
