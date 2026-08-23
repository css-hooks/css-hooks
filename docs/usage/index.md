---
title: Usage
description: How to apply CSS Hooks in component styles
order: 5
---

# Usage

This guide demonstrates how to use CSS Hooks to apply conditional styles to your
components with the `pipe` and `on` functions.

## Basic usage

To apply styles to a component, use the `pipe` function to define the base
(default) styles and the `on` function to define conditional styles that
override the base styles when certain conditions are met.

### Example: Base styles

```jsx
// src/button.tsx

import { pipe } from "remeda";

function Button() {
  return (
    <button
      style={pipe({
        background: "#666", // base value
        color: "white",
      })}
    >
      Click Me
    </button>
  );
}
```

### Example: Adding conditional styles

```jsx
// src/button.tsx

import { pipe } from "remeda";
import { on, and, or } from "./css";

function Button() {
  return (
    <button
      style={pipe(
        {
          background: "#666", // base value
          color: "white",
        },
        on(or(and("@media (hover: hover)", "&:hover"), "&:focus"), {
          background: "#009", // conditionally applied value on hover or focus
        }),
        on("&:active", {
          background: "#900", // conditionally applied value when active
        }),
      )}
    >
      Hover, Focus, or Click Me
    </button>
  );
}
```

## Important: Avoiding property conflicts

When defining conditional styles, ensure you do not mix shorthand and longhand
property names between base and conditional styles. For example, avoid using
both `margin` and `marginLeft` for the same element to prevent unexpected
behavior.

## Factoring out reusable conditions

If you frequently use specific combinations of hooks, consider defining them as
reusable conditions and exporting them from your `css.ts` module. For example:

```typescript
// src/css.ts

export const hoverOnly = and("@media (hover: hover)", "&:hover");
export const intent = or(hoverOnly, "&:focus");
```

```jsx
// src/button.tsx

import { pipe } from "remeda";
import { on, intent } from "./css";

function Button() {
  return (
    <button
      style={pipe(
        {
          background: "#666", // base value
          color: "white",
        },
        on(intent, {
          background: "#009", // conditionally applied value on hover or focus
        }),
        on("&:active", {
          background: "#900", // conditionally applied value when active
        }),
      )}
    >
      Hover, Focus, or Click Me
    </button>
  );
}
```
