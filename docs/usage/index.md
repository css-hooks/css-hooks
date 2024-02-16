---
title: Usage
order: 5
---

# Usage

The primary interface you'll interact with is that of the `css` function, which
allows you to define style objects enhanced with conditional styles. To get
started, simply pass a style object argument, and then pass the return value to
the `style` prop:

```tsx
import { css } from "./css";

function Component() {
  return (
    <div
      style={css({
        color: "#333",
      })}
    >
      ...
    </div>
  );
}
```

## Adding conditional styles

You can optionally add a `match` function to define conditional styles:

```tsx
import { css } from "./css";

function Component() {
  return (
    <div
      style={css({
        color: "#333",
        match: on => [
          on("&:hover", {
            color: "blue",
          }),
        ],
      })}
    >
      ...
    </div>
  );
}
```

Notice that the `match` function accepts an `on` argument and returns an array
of conditional styles.

The `on` function constructs a conditional style. The first parameter defines a
_condition_ (e.g. a hook), and the second is the style object that applies when
that condition is true.

## Advanced conditions

You can create advanced conditions with combinational logic using a few helper
functions:

- The `all` function accepts a variable number of condition arguments. It
  returns a condition that is true when all of the specified conditions are
  true.
- The `any` function accepts a variable number of condition arguments. It
  returns a condition that is true when any of the specified conditions are
  true.
- The `not` function accepts a single condition argument and returns the inverse
  condition.

These helpers are passed to the `match` function in a destructurable second
argument.

For example, you can combine `&:enabled` and `&:hover` hooks using the `all`
helper to ensure that a hover effect applies only when the element is also
enabled:

```tsx
import { css } from "./css";

function MyButton() {
  return (
    <button
      style={css({
        match: (on, { all }) => [
          on(all("&:enabled", "&:hover"), {
            color: "blue",
          }),
        ],
      })}
    >
      ...
    </button>
  );
}
```
