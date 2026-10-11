---
title: Applying styles
description: Implementing conditional style declarations with CSS Hooks
order: 4
---

# Applying styles

With CSS Hooks, styling stays in the `style` prop. The `mergeStyles` and `on`
functions make that possible. This guide explains how they work together to
construct style objects with conditional overrides.

```tsx
// src/button.tsx

import { and, mergeStyles, on } from "./css";

export function Button() {
  return (
    <button
      style={mergeStyles(
        {
          background: "#666",
          color: "white",
          transition: "background 150ms, transform 75ms",
        },
        on(and("@media (hover: hover)", "&:hover"), {
          background: "#009",
        }),
        on("&:hover", {
          transform: "scale(0.98)",
        }),
      )}
    >
      Save changes
    </button>
  );
}
```

## Style object composition

The `mergeStyles` function processes style objects from left to right. Each
object's properties move to the end of the result, overriding matching
properties from earlier objects. This ensures that input order determines
priority. `mergeStyles` also resolves each conditional property against the
value it overrides.

> [!WARNING] Do not use object spread instead of the `mergeStyles` function when
> combining base and conditional styles. Object spread does not resolve
> conditional property fallback values.

## Conditional overrides

The `on` function encodes a hook or condition in a style object. `mergeStyles`
then resolves each declaration's fallback from the corresponding value
accumulated from earlier style object arguments.

In the preceding example, `on(and("@media (hover: hover)", "&:hover"), ...)`
changes the background on hover-capable devices, while `on("&:hover", ...)`
scales the button on any device.

## Override priority

The `mergeStyles` function prioritizes later arguments over earlier ones. This
means that conditional styles should be ordered from broader conditions to more
specific ones. Consumer styles (for example, the `style` prop value passed to a
custom component) should generally be passed as the last argument so internal
component styles do not override them unexpectedly.

```tsx
style={mergeStyles(
  { background: "#666" },
  on("&:hover", { background: "#009" }),
  on("&:active", { background: "#900" }),
  on("&:disabled", { background: "#aaa" }),
  consumerStyle,
)}
```

This example shows how order matters. The `:hover` and `:disabled`
pseudo-classes can both be active at the same time, but in that case disabled
styles should usually override hover styles. Likewise, `:active` styles should
generally be prioritized over `:hover` styles when the element is pressed.

The final `consumerStyle` argument represents a value passed to a custom
component's `style` prop. It overrides the previous value for each property
unconditionally.

## Property conflicts

Certain combinations of CSS properties can produce unexpected results at
runtime. Notable conflicts include shorthand properties and their longhand
equivalents, physical and logical properties that affect the same edge, and
aliases. Avoid mixing these properties across base styles and overrides.

The TypeScript types for the React, Preact, Solid, and Qwik integrations report
these conflicts in calls to `mergeStyles`. Because some declarations overlap
only in certain writing modes, the check is intentionally conservative.

Conflict checking requires the specific keys of each style object to be
retained. If you annotate a reusable style with a broad framework type such as
`CSSProperties`, use `satisfies` instead:

```typescript
const baseStyle = {
  color: "black",
} satisfies CSSProperties;
```

This protection is compile-time only. JavaScript users and custom integrations
built directly with `@css-hooks/core` do not receive it automatically; those
integrations must supply a property-conflict map.
