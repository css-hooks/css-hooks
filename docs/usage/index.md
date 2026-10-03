---
title: Usage
description: Implementing conditional style declarations with CSS Hooks
order: 5
---

# Usage

`mergeStyles()` combines ordinary style objects with conditional styles from
`on()` and flag controls from `enable()` or `disable()`. Inputs are applied from
left to right, with later values taking precedence. `null` and `undefined` are
ignored, so optional styles can be passed directly. It also resolves conditional
fallback values and reports conflicting CSS properties. A hook's styles apply
only while its registered condition matches.

```tsx
// src/button.tsx

import { intent, mergeStyles, on } from "./css";

export function Button() {
  return (
    <button
      style={mergeStyles(
        {
          background: "#666",
          color: "white",
          transition: "background 150ms, transform 75ms",
        },
        on(intent, {
          background: "#009",
        }),
        on("&:active", {
          transform: "scale(0.98)",
        }),
      )}
    >
      Save changes
    </button>
  );
}
```

This example assumes the hooks in the [Configuration](../configuration/index.md)
guide: The `intent` hook combines `@media (hover: hover)`, `&:hover`, and
`&:focus-visible`; `&:active` is registered separately.

> [!WARNING] Do not use object spread as a substitute for `mergeStyles` when
> combining base and conditional styles. `mergeStyles` resolves each conditional
> property's fallback to the preceding value; object spread cannot.

## Override order

When multiple matching hooks set the same property, the later override passed to
`mergeStyles` wins. Put broad conditions first and more specific states
afterward.

```tsx
style={mergeStyles(
  { background: "#666" },
  on("&:hover", { background: "#009" }),
  on("&:active", { background: "#900" }),
)}
```

Here, an active button is also hovered, but the `&:active` override takes
precedence.

## Avoid shorthand conflicts

Do not mix a shorthand property with one of its longhands across base styles and
override styles. This is a
[widely recognized source of defects](https://github.com/react/react/blob/f1f7ed2ac267a21dd2e3e67c4a606b9cf56e360b/packages/react-dom-bindings/src/client/CSSPropertyOperations.js#L247-L251)
in inline styles. Instead, use the shorthand exclusively or its longhand
equivalents throughout the base style object and overrides.

`mergeStyles()` reports these conflicts as it composes the styles.

## Reuse conditions

Keep frequently used conditions in `css.ts`, where they can be composed and
exported alongside `on`. See [Configuration](../configuration/index.md) for an
example using `and` and `or`.

## Advanced usage

Read the [Components](../components/index.md) guide to build reusable components
with prop-driven styles and expose a public `style` prop as an escape hatch.
