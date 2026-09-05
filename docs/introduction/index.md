---
title: Introduction
description: Use CSS selectors and at-rules with component style props.
order: 1
---

# Introduction

CSS Hooks lets you use CSS selectors and at-rules with the `style` prop. Define
the conditions your application needs once, then apply base styles and override
styles directly in a component.

```tsx
<button
  style={pipe(
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

The conditions in this example are ordinary CSS:

- Pseudo-classes such as `&:hover`, `&:focus-visible`, and `&:active`
- Stateful and contextual selectors such as `:checked + &` and `.group:hover &`
- At-rules such as `@media`, `@container`, and `@supports`

## The purpose of CSS Hooks

Typically most CSS in an application amounts to a declaration plus a condition,
like a hover state, container query, or contextual selector. Those conditions
filter declarations for the current element. CSS Hooks turns that filtering
logic into hooks, so that the declarations can remain in the element's style
object.

CSS Hooks does not try to eliminate stylesheets completely. Instead, it can
reduce them to a maintainable scale: Only the rulesets that must actually live
in a stylesheet, such as keyframes, pseudo-elements, and rules targeting markup
outside your control. CSS Hooks renders a small plumbing-only stylesheet once at
the application root. Your components own their styles.

## Next steps

Start with a [Quickstart](../quickstart/index.md) to create a new project, or
use [Setup](../setup/index.md) when adding CSS Hooks to an existing or custom
application.
