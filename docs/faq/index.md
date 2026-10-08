---
title: FAQ
description: Answers to common questions about CSS Hooks
order: 8
---

# FAQ

## How does CSS Hooks work?

CSS Hooks renders a small stylesheet that tracks the declared selectors,
at-rules, and flags. Declarations apply directly on an element through its
`style` prop. Conditions are encoded in each value. The stylesheet activates
conditions without requiring specialized rulesets per component.

## Which rules belong in a stylesheet?

CSS Hooks works by filtering an element's own style declarations with
conditions. Some rules do not fit that model, such as `@keyframes`,
pseudo-elements like `::before` and `::after`, and styling for markup you do not
control. Prefer inline styles where possible; otherwise, keep the rule in a
stylesheet.

## How can an ancestor apply styles to a descendant element?

Hooks do not allow an ancestor to style a descendant directly. Instead, a hook
acts as a filter on declarations, activating when the element to which they
apply matches the hook's logic. Such logic can include contextual selectors, so
you can style a descendant based on its position within a group:

<!--prettier-ignore-start-->
```tsx
// The child changes when an ancestor with class="group" is hovered.
on(".group:hover &", {
  color: "rebeccapurple",
})
```
<!--prettier-ignore-end-->

For more advanced use cases, [Flags](../flags/index.md) offer a way to share
state with descendants without mutating their presentational properties. The
descendant's own declarations determine its appearance as a function of that
state.

For cases where you do not control the descendant markup, a traditional
stylesheet may be the appropriate tool.

## Why don't hooks support pseudo-elements?

Pseudo-elements target virtual elements rather than the existing element that
owns a style object. Use a physical element when possible, or keep the
pseudo-element rule in a stylesheet.

> [!NOTE] Some common use cases for pseudo-elements can be solved with physical
> elements instead. For example, a physical placeholder element's visibility can
> be controlled using the `:placeholder-shown` pseudo-class, as demonstrated in
> the [Custom placeholder](../recipes/custom-placeholder/) recipe.

## Is CSS Hooks widely supported in browsers?

CSS Hooks supports the following browser versions:

| <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/chrome/chrome_24x24.png" alt="Chrome" /><br/>Chrome | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/edge/edge_24x24.png" alt="Edge" /><br/>Edge | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/safari/safari_24x24.png" alt="Safari" /><br/>Safari | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/firefox/firefox_24x24.png" alt="Firefox" /><br/>Firefox | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/opera/opera_24x24.png" alt="Opera" /><br/>Opera |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| <div align="center">111+</div>                                                                                            | <div align="center">111+</div>                                                                                    | <div align="center">18+</div>                                                                                             | <div align="center">151+</div>                                                                                                | <div align="center">98+</div>                                                                                         |

## Do inline styles negatively impact performance?

No. Inline styles have significant performance advantages over stylesheets,
including more efficient code-splitting and the elimination of render-blocking
stylesheet requests. In
[Are Inline Styles Faster than CSS?](https://web.archive.org/web/20240509083202/https://danielnagy.me/posts/Post_tsr8q6sx37pl),
Daniel Nagy measures inline styles against stylesheets across rendering time,
HTML and JavaScript size, browser performance, and Web Vitals, and finds that
inline styles often outperform stylesheets. A
[2026 benchmark thread](https://x.com/agilecoder/status/2095557324517835230)
comparing inline styles with static CSS reaches a similar conclusion.

## What if my question is not answered here?

[Start a discussion.](https://github.com/css-hooks/css-hooks/discussions/new?category=q-a)
