---
title: Introduction
description: CSS-powered conditional styling with inline style simplicity
order: 1
---

# Introduction

CSS Hooks adds CSS-powered conditions to inline styles. It lets an element's
`style` prop respond to user interaction, layout, browser capabilities,
surrounding markup, and inherited state.

Define shared conditions once; then build them into ordinary style objects. For
example, this button provides visual feedback on hover and press:

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

Inline styles have several advantages over stylesheets:

- **Familiar, typed syntax.** Inline styles use standard CSS properties and
  values as plain objects, so editors provide completion and type checking and
  there is no new language or abstraction to learn.
- **Local reasoning.** Declarations live with the element they style, so there
  is no separate stylesheet to consult and no dead CSS left over after a design
  change or refactor.
- **Deterministic resolution.** Inline styles take precedence over stylesheet
  rules and apply in the order you write them, so there are no specificity,
  source-order, or cascade-layer surprises.
- **Dynamic values.** Values can be computed from data or state directly.
- **No build step.** Nothing needs to be compiled, extracted, or generated ahead
  of time.
- **No render-blocking request.** There is no separate stylesheet to download
  before the element can render.

The main gap is conditionality: The `style` prop cannot express states or
context such as `&:hover`, container queries, or inherited state.

## Why CSS Hooks

CSS Hooks adds capabilities to inline styles while keeping their advantages.
Compared with other styling approaches:

- Does not inject styles at runtime, unlike typical CSS-in-JS solutions
- Does not require a compiler or restrict styles to statically analyzable
  values, unlike "zero runtime" CSS solutions
- Keeps the familiar syntax of the `style` prop, unlike atomic or
  "utility-first" CSS solutions

Building on inline styles, CSS Hooks provides:

- Conditional selector and at-rule logic
- `and`, `or`, and `not` combinators that enable the expression of advanced
  conditions through hook composition
- CSS-driven interaction and responsive behavior without mirrored JavaScript
  state
- Predictable composition and fallback values through the `mergeStyles` function
- Inheritable Boolean state for coordinating styles across a subtree

Because conditions resolve through CSS, styles render on the server, including
in server components, without hydration mismatches.

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
