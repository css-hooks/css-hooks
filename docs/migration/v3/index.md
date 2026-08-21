---
title: v2 -> v3
description: Update your app to version 3 of CSS Hooks.
order: 1
---

# Migrating to v3

v3 introduces a simpler model for defining and using hooks, which is more
transparent, reduces syntax, and makes the library smaller and more efficient.
Let's dive in!

## New exports

Previously, the return value of `createHooks` included a `css` function. In v3
this is replaced by an `on` function, along with `and`, `or`, and `not`
functions for constructing complex conditions. Update your `css.ts` module to
export these new functions instead of `css`.

### Before

```typescript
// src/css.ts

export const { styleSheet, css } = createHooks(/* ... */);
```

### After

```typescript
// src/css.ts

export const { styleSheet, on, and, or, not } = createHooks(/* ... */);
```

## Simplified initialization

In v2, `createHooks` accepted a configuration object containing a map of hooks,
along with several options. The `on` function in v3 is smaller in scope than the
`css` function it replaces, making most of the configuration options redundant.

Key changes:

- Hooks are now identified by their selector logic, no longer using aliases.
- Complex conditions are defined using the `and`, `or`, and `not` functions
  instead of configuring them globally.

To migrate:

1. Replace the entire configuration object with the _values_ of the existing
   `hooks` object.
2. Since `createHooks` only accepts string values, replace any complex hooks
   with their individual components.

### Before

```typescript
// src/css.ts

export const {/* ... */} = createHooks({
  hooks: ({ or }) => ({
    "&:hover": "&:hover",
    "&:intent": or("&:hover", "&:focus"),
  }),
  sort: {
    properties: true,
    conditionalStyles: true,
  },
  fallback: "revert-layer",
  debug: true,
});
```

### After

```typescript
// src/css.ts

export const {/* ... */} = createHooks("&:hover", "&:focus");
```

## Defining reusable conditions

For globally-defined complex hooks (like the `&:intent` example in the previous
section), you can now use the `and`, `or`, and `not` functions to define them as
additional exports from your `css.ts` module.

### Example

```typescript
// src/css.ts

export const intent = or("&:hover", "&:focus");
```

## Function composition utilities

The v3 API uses two generic composition functions, widely available as `pipe`
and `flow` in other libraries. Please see the
[Setup](../../setup#function-composition-utilities) guide for a list of
libraries that provide these utilities as well as implementations you can
copy/paste into your own codebase if you prefer to avoid additional
dependencies.

## Updating inline styles

Finally, update any inline styles that were previously defined using the `css`
function:

1. Replace `css` with [`pipe`](../../setup#function-composition-utilities) or
   equivalent.
2. Move the `on` array's contents outside of the style object and pass them as
   additional arguments to `pipe` after the style object.
3. Remove the `on` field from the style object.
4. Update `$` function calls to use the new function `on`.
5. Import `on` from your `css.ts` module along with `and`, `or`, and `not`
   functions as needed for complex conditions.

### Before

```jsx
import { css } from "./css";

function HelloWorld() {
  return (
    <button
      style={css({
        color: "black",
        on: ($, { or }) => [
          $(or("&:hover", "&:focus"), {
            color: "blue",
          }),
          $("&:active", {
            color: "red",
          }),
        ],
      })}
    >
      Hello World
    </button>
  );
}
```

### After

```jsx
import { pipe } from "remeda"; // or from ts-belt, effect, fp-ts, etc.
import { on, or } from "./css";

function HelloWorld() {
  return (
    <button
      style={pipe(
        {
          color: "black",
        },
        on(or("&:hover", "&:focus"), {
          color: "blue",
        }),
        on("&:active", {
          color: "red",
        }),
      )}
    >
      Hello World
    </button>
  );
}
```

<!--prettier-ignore-start-->
> [!NOTE]
> If you had globally-defined complex hooks in v2, make sure to replace those references with the
> <span> </span>[reusable conditions](#defining-reusable-conditions)
> exported from your `css.ts` module.
<!--prettier-ignore-end-->
