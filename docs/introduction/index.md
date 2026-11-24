---
title: Introduction
description: CSS-powered conditional styling with inline style simplicity
order: 1
---

# Introduction

CSS Hooks adds CSS-powered conditions to inline styles. Hooks allow an element’s
`style` prop to respond to user interaction, layout, browser capabilities,
surrounding markup, and inherited state. Declare hooks once and reuse them
throughout your application to add conditional values to ordinary style objects.

For example, this button provides visual feedback on hover and press:

```tsx
<button
  style={mergeStyles(
    {
      background: "#666",
      color: "white",
    },
    on("&:hover", {
      background: "#009",
    }),
    on("&:active", {
      transform: "scale(0.98)",
    }),
  )}
>
  Save changes
</button>
```

The browser evaluates these conditions through CSS, without JavaScript event
listeners, component state, or style injection.

## Why inline styles

Inline styles have several important benefits:

- **Familiar, typed syntax.** Inline styles use ordinary style objects. You
  reuse existing CSS knowledge. Your editor provides autocompletion and type
  checking.
- **Local reasoning.** Declaring styles directly on an element means there is no
  separate stylesheet to read and no dead CSS code left over after a refactor.
- **Deterministic resolution.** Inline styles apply predictably in the order you
  write them—with no cascade interference.
- **Efficient loading.** Inline styles avoid render-blocking CSS requests and
  naturally follow component code-splitting boundaries.

The main gap is conditionality: The `style` prop cannot express states or
context such as `&:hover`, container queries, or inherited state.

## Why CSS Hooks

CSS Hooks provides advanced styling capabilities without sacrificing the
advantages of native inline styles. Compared with other approaches, it

- does not inject styles at runtime, unlike typical CSS-in-JS solutions;
- keeps the familiar syntax of the `style` prop, unlike atomic or
  "utility-first" CSS solutions; and
- does not require a compiler or restrict styles to statically analyzable
  values, unlike "zero runtime" CSS solutions.

Building on inline styles, CSS Hooks provides

- selector, at-rule, and inherited Boolean state hooks, evaluated entirely in
  CSS;
- `and`, `or`, and `not` combinators that allow advanced conditions to be
  expressed through hook composition;
- predictable style overrides through the `mergeStyles` function; and
- frictionless server rendering and inherent support for server components.

## How it fits with CSS

CSS Hooks cannot replace stylesheets entirely, but it can reduce them to a
maintainable scale. You can reserve them for rules that must live there, such as
keyframes, pseudo-elements, and rules that target markup outside your control.

CSS Hooks itself renders one small stylesheet amounting to "plumbing code" for
evaluating declared hooks. It does not create a ruleset for every component or
inject styles as components render. Components render their own styles.

## Next steps

Follow the [Quickstart](../quickstart/index.md) for your framework or browser
environment.
