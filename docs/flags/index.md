---
title: Flags
description: Sharing inherited Boolean state with descendant style props
order: 5
---

# Flags

Styling state may need to propagate through a subtree while remaining
overridable within nested sections. For example, a nested section may invert the
theme or change the layout density.

A **flag** is a hook that carries such state from an element to its descendants.

## Basic usage

Declare a flag with the `%<name>` syntax:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, enable, disable, styleSheet } = createHooks("%dark");
```

Flags are disabled by default. Use the `enable` and `disable` functions to
control the value of a flag for an element and its descendants:

```tsx
<main style={enable("%dark")}>{/* Dark subtree */}</main>
```

When enabled, a flag activates conditional styles just like any other hook:

```tsx
const panelStyle = mergeStyles(
  { background: "#fff", color: "#000" },
  on("%dark", { background: "#000", color: "#fff" }),
);
```

In this case, the panel has a white background and black text by default. When
an ancestor enables `%dark`, the panel has a black background and white text.

## Nested overrides

A nested call to `enable` or `disable` overrides the value for the element and
its descendants:

```tsx
<main style={enable("%dark")}>
  <section style={disable("%dark")}>
    <div>{/* Light subtree */}</div>
  </section>
</main>
```

## Multiple flags

The `enable` and `disable` functions are variadic, so they can set multiple
declared flags together:

```tsx
<main style={enable("%dark", "%compact")}>{/* Dark, compact subtree */}</main>
```

## Inversion

The element carrying the `enable` or `disable` function observes the newly
assigned value. When either function is applied conditionally, it observes the
value from the nearest ancestor. This makes it possible to invert a flag without
creating a cycle:

```typescript
const invertDark = mergeStyles(
  on(not("%dark"), enable("%dark")),
  on("%dark", disable("%dark")),
);
```

When the inherited `%dark` flag is disabled, the style enables it for the
element and its descendants. When the inherited flag is enabled, the style
disables it instead. See the
[Automatic light/dark inversion](../recipes/automatic-light-dark-inversion/)
recipe for a complete example.
