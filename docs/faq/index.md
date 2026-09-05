---
title: FAQ
description: Answers to common questions about CSS Hooks.
order: 6
---

# FAQ

## How does CSS Hooks work?

CSS Hooks generates a small stylesheet that tracks the registered selectors and
at-rules with custom properties. The declarations themselves remain in each
element's style object. This is why conditions such as `&:hover` and
`@container` can control override styles without creating a new stylesheet for
each component.

## Which rules belong in a stylesheet?

CSS Hooks is intended to move conditional declarations out of stylesheets, not
to eliminate stylesheets altogether. Keep rules in a stylesheet when they cannot
filter an existing element's style object, including `@keyframes` and
pseudo-elements such as `::before` and `::after`.

You may also need a stylesheet for markup that you cannot style directly, such
as third-party components. The remaining stylesheet is usually small and has a
clear purpose.

## Why can't a parent's hooks affect descendant elements?

A hook filters the style object on the element it matches. A parent's override
styles cannot assign declarations to its children. Put the child's styles on the
child, then use a contextual selector that targets that child:

<!--prettier-ignore-start-->
```tsx
// The child changes when an ancestor with class="group" is hovered.
on(".group:hover &", {
  color: "rebeccapurple",
})
```
<!--prettier-ignore-end-->

If you cannot control the child markup, a traditional stylesheet selector may be
the appropriate tool.

## Why don't hooks support pseudo-elements?

Pseudo-elements target virtual elements rather than the existing element that
owns a style object. Use a physical element when that suits the markup, or keep
the pseudo-element rule in a stylesheet.

## Is CSS Hooks widely supported in browsers?

CSS Hooks requires support for the `revert-layer` keyword, which is available in
all modern browsers:

| <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/chrome/chrome_24x24.png" alt="Chrome" /><br/>Chrome | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/edge/edge_24x24.png" alt="Edge" /><br/>Edge | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/safari/safari_24x24.png" alt="Safari" /><br/>Safari | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/firefox/firefox_24x24.png" alt="Firefox" /><br/>Firefox | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/opera/opera_24x24.png" alt="Opera" /><br/>Opera |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| <div align="center">99+</div>                                                                                             | <div align="center">99+</div>                                                                                     | <div align="center">15.4+</div>                                                                                           | <div align="center">97+</div>                                                                                                 | <div align="center">85+</div>                                                                                         |

## Do inline styles negatively impact performance?

No. Inline styles have significant runtime performance advantages over CSS,
including more efficient code-splitting and the elimination of render-blocking
CSS requests. In
[Are Inline Styles Faster than CSS?](https://web.archive.org/web/20240509083202/https://danielnagy.me/posts/Post_tsr8q6sx37pl),
Daniel Nagy evaluates inline styles and CSS across rendering time, HTML and
JavaScript size, browser performance, and Web Vitals, concluding that inline
styles often outperform CSS in these areas. A
[2026 benchmark thread](https://x.com/agilecoder/status/2095557324517835230)
comparing inline styles with static CSS tells a similar story.

## What if my question is not answered here?

[Start a discussion.](https://github.com/css-hooks/css-hooks/discussions/new?category=q-a)
