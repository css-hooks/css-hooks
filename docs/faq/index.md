---
title: FAQ
description: Addressing frequently asked questions about CSS Hooks
order: 6
---

# FAQ

## Why can't hooks affect descendant elements?

This is primarily a limitation of inline styles, which are scoped strictly to
the element to which they are applied (although individual properties can be
inherited). Hooks don't add full CSS selector capabilities to inline styles.
Instead, they allow you to toggle between arbitrary values depending on the
boolean state of a CSS rule. The [Introduction](../introduction/index.md)
describes this mechanism and can help with understanding why the limitation
exists.

Generally, the best solution is to apply inline styles directly to the
descendant elements you want to affect, using hooks to change values based on
surrounding context if necessary. For example, instead of using an (invalid)
`.group:hover *` hook on the parent element to modify descendants' properties on
hover, you would use a `.group:hover &` hook on _each descendant element_ to
change its properties based on the hover state of the `.group` ancestor.

Although we consider them edge cases, situations indeed exist where you can't
control certain markup, and descendant selectors provide the only means for
applying styles. For example, this is common with third-party libraries. For
these cases, we simply recommend maintaining a global style sheet the
"traditional" way. Using inline styles and hooks when possible can still help to
keep this style sheet small enough to avoid maintainability issues.

## Why don't hooks support pseudo-elements?

Most of the time, a selector or at-rule defines a condition under which a
[declaration block](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#css_declaration_blocks)
applies to an element. Hooks exploit the fact that these conditions can be
encoded in CSS Variables for use within inline styles.

Pseudo-element selectors are different in nature. Rather than defining when a
rule should apply to an existing DOM element, pseudo-element selectors create
virtual elements, or target elements that don't correspond to markup.

Fortunately, in some cases pseudo-elements are unnecessary:

- `::before` and `::after` are equivalent to physical elements added as the
  first and last children respectively.
- Instead of `::first-letter`, you can wrap the first letter in a `<span>` and
  apply inline styles to that.
- You can use the `:placeholder-shown` pseudo-class (in a hook) to show a
  physical placeholder element conditionally, rather than styling
  `::placeholder`.

When you must use a pseudo-element, you can simply maintain a small global style
sheet the "traditional" way. Using inline styles and hooks for everything else
will still help you to keep this small and maintainable. You could also consider
using a
[custom property](https://github.com/css-hooks/css-hooks/discussions/70#discussioncomment-8551472)
to make this approach more flexible and promote reuse.

## What if my question isn't answered here?

Please
[start a discussion](https://github.com/css-hooks/css-hooks/discussions/new?category=q-a).
