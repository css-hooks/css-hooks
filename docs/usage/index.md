---
title: Usage
description: Apply base styles and override styles with CSS Hooks.
order: 5
---

# Usage

Use `pipe()` to start with base styles and apply override styles with `on()`. A
hook's override styles apply only while its registered condition matches.

```tsx
// src/button.tsx

import { pipe } from "remeda";

import { intent, on } from "./css";

export function Button() {
  return (
    <button
      style={pipe(
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
guide: `intent` combines `@media (hover: hover)`, `&:hover`, and
`&:focus-visible`; `&:active` is registered separately.

## Override order

When multiple matching hooks set the same property, the later override in the
pipeline wins. Put broad conditions first and more specific states afterward.

```tsx
style={pipe(
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

## Reuse conditions

Keep frequently used conditions in `css.ts`, where they can be composed and
exported alongside `on`. See [Configuration](../configuration/index.md) for an
example using `and` and `or`.
