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

## Conditional controls

Controls can apply conditionally. For example, this style inverts the inherited
`%dark` flag:

```typescript
const invertDark = mergeStyles(
  on(not("%dark"), enable("%dark")),
  on("%dark", disable("%dark")),
);
```

Conditions on `enable` or `disable` are always evaluated against _inherited_
flag values. This avoids circular logic that would silently break at runtime.

Conditions on ordinary style declarations are evaluated against the element's
own flag values.
