---
title: Introduction
description:
  An overview of CSS Hooks, what it is, how it works, and why it's useful.
order: 1
---

# Introduction

For years, web developers have asked, _how can I write `a:hover` in inline
styles?_ In times past, this was usually dismissed as a newbie question,
something you can't do _and shouldn't want to_ because inline styles were widely
assumed to be less maintainable than style sheets. But as component-based
architecture gained traction, it became increasingly clear to many that the
opposite was actually true: Inline styles would allow a component to encapsulate
markup, styling, and behavior, avoiding both the context switch of maintaining
an external CSS file _and_ the error-prone nature of indirect style references
(via selector logic). The problem: It was still true that inline styles didn't
support pseudo-classes, media queries, or various other CSS features.

As a result, many heavy-handed styling solutions emerged to address these
feature gaps, ranging from

- Atomic CSS, which asks you to learn a new, non-standard, perhaps inexpressive,
  utility class syntax; to
- CSS-in-JS, which generates and injects style sheets into the DOM as the user
  traverses the application; to
- "Zero-runtime" solutions, which replace runtime style injection with
  complicated build processes in order to produce static CSS files.

These solutions have all delivered tremendous value and demonstrated what modern
UI architecture should look like. But each one is also prone to cascade defects
and, as with most complex systems, any number of other unique downsides.

CSS Hooks takes a new approach of _extending_ the capabilities of the `style`
prop, rather than replacing it with an entirely different system. The `:hover`
pseudo-class is just the beginning: You can use the full range of
pseudo-classes, custom selector logic, `@media` queries, and more. The best part
is that it is _simple_, requiring no build steps, no runtime style injection,
and no changes to existing inline style syntax. If it sounds too good to be
true, you're not alone in this belief. But read on, and you'll find that an
obscure CSS technique provides just the mechanism we need to do the "impossible"
with inline styles. It's built on CSS Variables, but you probably haven't seen
them used quite like this.

## CSS Variables

Consider a conventional use case for CSS Variables:

```html
<span style="--success-color: green; color: var(--success-color)">...</span>
```

Notice that the `var()` function is a simple reference to the `--success-color`
property, making the whole inline style equivalent to `color: green`. In this
trivial example, the use of a variable clearly doesn't provide any benefit; but,
since these so-called _custom properties_ can be inherited from ancestor
elements, you can use them to avoid repeating a value (like a color) throughout
your application, or even for more advanced use cases (like theming).

Especially when considering inheritance, it's easy to imagine a scenario where
you might reference a custom property that hasn't been set. Fortunately, the
`var()` function accounts for this possibility by allowing you to specify a
fallback value, e.g. `var(--success-color, #0c0)`—`#0c0` being the fallback
value to use in case `--success-color` isn't set or is set to an _invalid
value_.

## The fallback trick

The
[CSS Custom Properties spec](https://www.w3.org/TR/css-variables/#guaranteed-invalid)
describes two special values that, in conjunction, actually make CSS Variables
_programmable_:

1. The `initial` value of a custom property is a _guaranteed-invalid value_.
2. An empty value written explicitly, e.g. `--foo: ;` is a _valid value_.

In other words:

1. When you reference a variable whose value is `initial`, the fallback value
   will be used instead.
2. When you reference a variable whose value is empty, that empty value will be
   used (but it will have no effect on the
   [declaration](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#css_declarations)).

With this knowledge, you can do the unthinkable—implement a hover effect within
an inline style:

```html
<a href style="color: var(--hover-on, red) var(--hover-off, blue)">
  Hover me
</a>
<style>
  * {
    --hover-off: initial;
    --hover-on: ;
  }
  :hover {
    --hover-off: ;
    --hover-on: initial;
  }
</style>
```

[Live demo](https://htmlpreview.github.io/?https://github.com/css-hooks/css-hooks/blob/master/docs/introduction/demo.html)

As you can see, a style sheet is technically still required, but it only
controls the states of the `--hover-off` and `--hover-on` variables, allowing
you to toggle between arbitrary values defined within the inline style. Because
it doesn't define any presentational values, this hover "hook" can be used over
and over again throughout your application without any additional CSS overhead.

## The pitfalls of the fallback trick

Although the mechanism underlying the fallback trick is quite simple, actually
using this technique _directly_ is a bit complicated. The pain points include:

1. **Defining "hooks".** Although the "hook pattern" in the style sheet does
   click after a while, this remains a tedious and repetitive task.
1. **Aligning variable names.** Just as with a class name, you need to ensure
   that the variable names in the style sheet match the ones referenced in the
   markup.
1. **Challenging syntax.** CSS Variable syntax is widely regarded as less than
   beautiful, and it is even less readable when using the fallback trick.
   Combining multiple states (e.g. `:enabled` + `:hover`) requires nested
   expressions, compounding this issue.
1. **No type safety.** The type safety of the `style` prop doesn't extend to
   variable references or fallback values since they are embedded in a string.
1. **No auto-completion.** Lacking type information, your code editor won't be
   able to help you much to implement the pattern successfully.

## CSS Hooks

This library allows you to harness the power of the fallback trick through a
familiar, convenient, and type-safe interface. Here's how it works:

1. Defining a hook is as easy as writing a CSS selector or at-rule.
1. The underlying variables are created automatically, so you don't need to
   worry about naming, scoping, or maintaining references.
1. The familiar syntax of the `style` prop is extended to allow you to leverage
   your hooks through conditional style objects. You don't even see the
   underlying variables!
1. The type safety of the style object syntax is extended to include hooks.
1. Native TypeScript auto-completion makes hooks easy to use, with no need to
   install any additional editor extensions.
