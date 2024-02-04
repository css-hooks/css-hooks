---
title: Configuration
order: 1
---

# Configuration

To address a wide range of use cases, hooks are fully configurable. This
flexibility means you can use our "recommended" hooks as a starting point and/or
create your own custom set of hooks if you prefer.

## Recommended hooks

<!-- prettier-ignore-start -->
> [!NOTE]
> Requires TypeScript version 5.3 or later.
<!-- prettier-ignore-end -->

To get up and running with some sensible defaults, you can install
`@css-hooks/recommended` via NPM or your package manager of choice, e.g.:

```bash
npm install @css-hooks/recommended
```

Then, in your `src/css.ts` module (or equivalent), you can import and use the
`recommended` function to conveniently configure a number of useful hooks:

```typescript
import { createHooks } from "@css-hooks/react";
import { recommended } from "@css-hooks/recommended";

export const { styleSheet, css } = createHooks({
  hooks: recommended({
    // This creates media query hooks using the specified breakpoints:
    // 1. @media (width < 500px)
    // 2. @media (500px <= width < 1000px)
    // 3. @media (1000px <= width)
    breakpoints: ["500px", "1000px"],

    // This creates media query hooks using the specified color schemes:
    // 1. @media (prefers-color-scheme: dark)
    // 2. @media (prefers-color-scheme: light)
    colorSchemes: ["dark", "light"],

    // This creates basic selector hooks for each of the pseudo-classes specified:
    // 1. &:hover
    // 2. &:focus
    // 3. &:active
    // 4. &:disabled
    pseudoClasses: [":hover", ":focus", ":active", ":disabled"],
  }),
});
```

To combine these with additional custom hooks, simply spread the returned
object:

```typescript
import { createHooks } from "@css-hooks/react";
import { recommended } from "@css-hooks/recommended";

export const { styleSheet, css } = createHooks({
  hooks: {
    ...recommended({
      // configuration for recommended hooks
    }),
    // custom hooks
  },
});
```

## Custom hooks

In cases where the `recommended` function doesn't provide what you need, you can
fall back to defining custom hooks using the base hook configuration format.
That is, a record with each entry consisting of a hook name (the alias used to
reference the hook in conditional styles) and its implementation. For example:

```typescript
import { createHooks } from "@css-hooks/react";

export const { styleSheet, css } = createHooks({
  ".group &:hover": ".group &:hover",
  "&:intent": "&:hover, &:focus",
  darkMode: ".dark &",
});
```

### Hook syntax

Hooks are implemented using CSS syntax. Each hook may consist of a selector; a
`@container`, `@media`, or `@supports` query; or a logical combination of any of
these.

#### Selectors

A hook that activates when the element matches a selector can be represented
with a _selector_ spec, e.g.

- **`"&:hover"`**: Activates when the cursor is positioned over the element.
- **`":checked + &"`**: Activates when the previous sibling matches the
  `:checked` pseudo-class.
- **`".group:hover &"`**: Activates when an ancestor element has the `group`
  class and matches the `:hover` pseudo-class.
- **`".dark &"`**: Activates when an ancestor has the `dark` class.

The only change to native selector syntax is the use of `&` as a placeholder for
the element where the hook is applied. For an overview of CSS selectors, see
[CSS selectors (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors).

#### Media queries

A media query hook activates when certain media types and/or features are
matched, e.g.

- `"@media (prefers-color-scheme: dark)"`
- `"@media (max-width:499px)"`
- `"@media print"`

For more information about media queries, see
[@media (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media).

#### Container queries

A container query hook activates when the specified container condition(s) are
matched, e.g.

- `"@container (width > 500px)"`
- `"@container (width > 500px) or (height > 500px)"`
- `"@container (width > 500px) and (height > 500px)"`

To learn more, see
[@container (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@container).

#### Feature queries

A feature query hook activates when certain support conditions are matched, e.g.

- `"@supports (display: grid)"`
- `"@supports (transform-origin: 5% 10%)"`
- `"@supports font-format(woff2)"`

See
[@supports (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) to
learn more about feature queries.

#### Logical combination hooks

CSS Hooks also provides helper functions that allow you to define complex hook
logic by combining selectors and at-rules. You can think of each selector,
at-rule, or combination as a _condition_.

- The `all` function accepts a variable number of condition arguments. It
  returns a condition that is true when all of the specified conditions are
  true.
- The `any` function accepts a variable number of condition arguments. It
  returns a condition that is true when any of the specified conditions are
  true.
- The `not` function accepts a single condition argument and returns the inverse
  condition.

To use these helper functions, modify the `hooks` field of the configuration
object. Change the record to a callback function which returns the same record.
The helpers are then passed as a destructurable callback argument.

For example, imagine you want to implement a magic
`@media (prefers-color-scheme: dark)` hook that takes a user setting into
account. Here's how that could be expressed using these helper functions:

```typescript
export const { styleSheet, css } = createHooks({
  hooks: ({ all, any }) => ({
    "@media (prefers-color-scheme: dark)": any(
      "[data-theme='dark'] &",
      all("@media (prefers-color-scheme: dark)", "[data-theme='auto'] &"),
    ),
  }),
});
```

Notice that the hook is activated when the user has explicitly configured a
theme setting (`[data-theme="dark"]` attribute on an ancestor element) _or_ when
the browser requests dark mode and the user has not configured a theme
(`[data-theme="auto"]` attribute on an ancestor element).

## Options

Aside from `hooks`, a few configuration options provide more granular control
over how CSS Hooks works.

### `debug`

Default: `false`

When debug mode is enabled:

1. The style sheet returned by the `styleSheet` function is pretty-printed.
2. Extra white space is included in inline style declarations for improved
   readability.
3. Hook identifiers (underlying CSS variables) are tagged with user-defined hook
   names.

### `fallback`

Default: `"revert-layer"`

The `fallback` option specifies the CSS keyword to use when a conditional style
does not apply and a default value is not specified for one of the properties,
e.g.

```tsx
<button
  style={css({
    match: on => [
      on("&:hover", {
        color: "red",
      }),
    ],
  })}
>
  ...
</button>
```

In this case, the style object produced would look like the following:

```json
{ "color": "var(--hover-on, red) var(--hover-off, <fallback>)" }
```

The configured value would be rendered in place of `<fallback>`.

Functionally, the best choice is
[`"revert-layer"`](https://developer.mozilla.org/en-US/docs/Web/CSS/revert-layer),
which rolls back to a user-defined style sheet if present. On the other hand,
[`"unset"`](https://developer.mozilla.org/en-US/docs/Web/CSS/unset) rolls back
directly to the user agent style sheet, ignoring any user-defined style sheets;
but it has better compatibility with older browsers. For compatibility data,
please see
[Web Platform Tests](https://wpt.fyi/results/css/css-cascade?label=master&label=stable&product=chrome-99.0.4844.84&product=edge-99.0.1150.55&product=firefox-97.0.2&product=safari-16.4%20%2818615.1.26.110.1%29&q=revert-layer)<!-- -->.

### `sort.properties`

Default: `true`

When enabled, properties are sorted according to input order, with the last
declaration having the highest priority.

When disabled, properties remain in the order in which they are first declared.

You may want to consider setting this to `false` if you have implemented your
own algorithm for sorting properties.

<!-- prettier-ignore-start -->
> [!WARNING]
> Except for the default value, this setting is experimental, and the behavior
> may change subtly in response to user feedback.
<!-- prettier-ignore-end -->

### `sort.conditionalStyles`

Default: `true`

This setting affects the way declarations are prioritized when multiple rules
(style object arguments) are passed to the `css` function.

When enabled, condition styles are applied after all base styles, giving them
higher priority.

When disabled, conditional styles defined in an earlier rule are overridden when
the same property is declared in a later rule.

Disabling this option may be a good choice for libraries where each component
exposes a standard `style` prop, accepting a flat style object and hiding CSS
Hooks as a private implementation detail. In this scenario, users would likely
expect client styles to override all previously-defined styles (even conditional
ones).

<!-- prettier-ignore-start -->
> [!WARNING]
> Except for the default value, this setting is experimental, and the behavior
> may change subtly in response to user feedback.
<!-- prettier-ignore-end -->
