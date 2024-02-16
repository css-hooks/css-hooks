---
title: Migrating to v2
order: 100
---

# Migrating to v2

v2 introduces a more composable model for hooks, adding flexibility and
promoting reuse. It also makes some future-proofing changes to the way you
configure and set up hooks. Let's dive in!

## Configuration

Previously, the `createHooks` function accepted two arguments: the first one
declaring the hooks, and the second passing configuration options. In v2, these
have been merged into a single configuration object. Some options have changed
as well.

### Merging hook declarations and configuration options

Pass a single object to the `createHooks` function. Move hook declarations under
the `hooks` field, and add any configuration options that were previously passed
in the second argument.

#### Before

```typescript
// src/css.ts

export const [hooks, css] = createHooks(
  {
    "&:hover": "&:hover",
  },
  {
    fallback: "revert-layer",
    debug: true,
  },
);
```

#### After

```typescript
// src/css.ts

export const { styleSheet, css } = createHooks({
  hooks: {
    "&:hover": "&:hover",
  },
  fallback: "revert-layer",
  debug: true,
});
```

### Updating the `fallback` option

In v2, the default value of the `fallback` option changed from `"unset"` to
`"revert-layer"`. If you're concerned about compatibility with older browsers,
you may want to consider setting this option:

```typescript
fallback: "unset",
```

For more information, see the [Configuration](../configuration/index.md) guide.

### Updating the `sort` option

If you previously used `sort: true`, you can simply remove that option, as it is
now enabled by default.

Otherwise, you can add the following to your configuration to disable sorting,
which most closely resembles the default behavior in v1:

```typescript
sort: {
  properties: false,
  conditionalStyles: false
}
```

For more information about sorting, please review the
[Configuration](../configuration/index.md) guide.

## Setup

In v1, the `createHooks` function returned a tuple containing (1) a CSS string
(the style sheet needed to support the configured hooks) and (2) the `css`
function used to create inline style rules. In v2, it returns an object instead.
This can be destructured in a similar manner.

### Destructuring the `createHooks` return value

Change the array (tuple) destructuring syntax to use object destructuring syntax
instead. Note that what was previously called `hooks` (by convention) has been
renamed to `styleSheet`.

#### Before

```typescript
// src/css.ts

export const [hooks, css] = createHooks(/* ... */);
```

#### After

```typescript
// src/css.ts

export const { styleSheet, css } = createHooks(/* ... */);
```

### Adding the style sheet

Find where the style sheet is rendered, e.g. in your root component. Update the
`hooks` import to the new name `styleSheet`, and invoke it as a function to
render the CSS string.

#### Before

```tsx
// src/app.tsx

import { hooks } from "./css";

export function App() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: hooks }} />
      <HomePage />
    </>
  );
}
```

#### After

```tsx
// src/app.tsx

import { styleSheet } from "./css";

export function App() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
      <HomePage />
    </>
  );
}
```

### Usage

The most prominent change in v2 is a more advanced syntax for conditional
styles, which allows hooks to be combined and reused more effectively. In v1,
nesting provided the means for hook composition, but this was strictly an "and"
operation. In v2, a `match` callback replaces nested style objects to enable
"or" and "not" operations—a slightly heavier, but much more powerful, syntax.

Wherever you use the `css` function, you'll need to migrate to the `match`
callback.

#### Basic use case

##### Before

```jsx
export function Button({ children }) {
  return (
    <button
      style={css({
        color: "blue",
        "&:hover": {
          color: "red",
        },
      })}
    >
      {children}
    </button>
  );
}
```

##### After

```jsx
export function Button({ children }) {
  return (
    <button
      style={css({
        color: "blue",
        match: on => [
          on("&:hover", {
            color: "red",
          }),
        ],
      })}
    >
      {children}
    </button>
  );
}
```

#### With compositional nesting

##### Before

```tsx
export function Button({ children }) {
  return (
    <button
      style={css({
        color: "blue",
        "&:enabled": {
          "&:hover": {
            color: "red",
          },
        },
      })}
    >
      {children}
    </button>
  );
}
```

##### After

```tsx
export function Button({ children }) {
  return (
    <button
      style={css({
        color: "blue",
        match: (on, { all }) => [
          on(all("&:enabled", "&:hover"), {
            color: "red",
          }),
        ],
      })}
    >
      {children}
    </button>
  );
}
```
