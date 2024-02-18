---
title: Usage
description: Create enhanced inline styles throughout your application.
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

You can optionally add an `on` field to define conditional styles:

```tsx
import { css } from "./css";

function Component() {
  return (
    <div
      style={css({
        color: "#333",
        on: $ => [
          $("&:hover", {
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

Notice that the `on` function accepts a `$` argument and returns an array of
conditional styles.

The `$` function constructs a conditional style. The first parameter defines a
_condition_ (e.g. a hook), and the second is the style object that applies when
that condition is true.

## Advanced conditions

You can create advanced conditions with combinational logic using a few helper
functions:

- The `and` function accepts a variable number of condition arguments. It
  returns a condition that is true when all of the specified conditions are
  true.
- The `or` function accepts a variable number of condition arguments. It returns
  a condition that is true when any of the specified conditions are true.
- The `not` function accepts a single condition argument and returns the inverse
  condition.

These helpers are passed to the `on` function in a destructurable second
argument.

For example, you can combine `&:enabled` and `&:hover` hooks using the `and`
helper to ensure that a hover effect applies only when the element is also
enabled:

```tsx
import { css } from "./css";

function MyButton() {
  return (
    <button
      style={css({
        on: ($, { and }) => [
          $(and("&:enabled", "&:hover"), {
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

## Alternate syntax

It's also possible to define conditional styles without a callback function,
i.e. using plain JSON. Simply provide conditional styles as an array of tuples,
with the condition as the first item and the applicable style object as the
second. For example:

```tsx
import { css } from "./css";

function MyButton() {
  return (
    <button
      style={css({
        on: [
          [
            { and: ["&:enabled", "&:hover"] },
            {
              color: "blue",
            },
          ],
          [
            "&:disabled",
            {
              color: "gray",
            },
          ],
        ],
      })}
    >
      ...
    </button>
  );
}
```

The alternate syntax may be useful in some cases due to technical constraints or
even as a matter of personal preference. But it's not our default recommendation
due to readability concerns, especially when using
[Prettier](https://prettier.io).
