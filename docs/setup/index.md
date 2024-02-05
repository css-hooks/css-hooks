---
title: Setup
order: 1
---

# Setup

CSS Hooks requires a small amount of setup, which may vary slightly depending on
your project's architecture. This guide offers a general overview. For specific
examples, please see the [Quickstart](../quickstart/index.md) section.

## Installation

If you haven't already, you should install one of the framework-specific
packages, e.g.

```bash
npm install @css-hooks/react
```

The options currently available are:

- `@css-hooks/react`
- `@css-hooks/preact`
- `@css-hooks/solid`
- `@css-hooks/qwik`

Alternatively, if you are using a different framework, you can simply install
`@css-hooks/core`.

## The `css.ts` module

First, you'll need a module dedicated to configuration/setup for CSS Hooks. You
can choose any file path you'd like, but our typical recommendation is
`src/css.ts`.

### Obtaining `createHooks`

<details>
<summary>From a framework package</summary>

If you are using one of the framework packages listed above, then you can simply
import the `createHooks` function.

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";
```

</details>

<details>
<summary>Using `@css-hooks/core` directly</summary>

If you are using `@css-hooks/core` rather than a framework-specific flavor of
CSS Hooks, then you will first need to create a `createHooks` function tailored
to your use case.

In this case, call the `buildHooksSystem` function to produce `createHooks`:

```typescript
// src/css.ts

import { buildHooksSystem } from "@css-hooks/core";

const createHooks = buildHooksSystem();
```

The default `createHooks` function has the following characteristics:

1. It types style objects as `Record<string, unknown>`, meaning that it doesn't
   offer much type safety for CSS properties.
2. It doesn't transform CSS values when converting them to strings; e.g. it
   won't automatically append `px` to a length defined as a `number` like some
   app frameworks do.

If you would like to override the default type for CSS properties, you can pass
a generic argument accordingly. For example, here's how you can integrate
[`csstype`](https://www.npmjs.com/package/csstype):

```typescript
// src/css.ts

import { buildHooksSystem } from "@css-hooks/core";
import type * as CSS from "csstype";

const createHooks = buildHooksSystem<CSS.Properties>();
```

If you would like to use custom logic for converting values to strings, you can
pass a this as a callback function:

```typescript
// src/css.ts

import { buildHooksSystem } from "@css-hooks/core";
import type * as CSS from "csstype";
import { isUnitlessNumber } from "unitless";

const createHooks = buildHooksSystem<CSS.Properties<string | number>>(
  (propertyName, value) => {
    switch (typeof value) {
      case "string":
        return value;
      case "number":
        return isUnitlessNumber(propertyName) ? `${value}` : `${value}px`;
      default:
        return null; // return null when the value can't be stringified
    }
  },
);
```

Once you have created your `createHooks` function, proceed to the next section.

</details>

### Creating hooks

Call `createHooks` to create and export `css` and `styleSheet` functions:

- The `css` function allows you to define inline styles enhanced with hooks; and
- The `styleSheet` function returns a style sheet (CSS string) required to
  support the configured hooks.

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { styleSheet, css } = createHooks({
  // TODO: Configure hooks and other options.
});
```

Please see the [Configuration](../configuration/index.md) guide for more
information.

## Adding the style sheet

Now you need to determine where to render the style sheet. Most likely, you'll
want to do this in your root component or the entry point for your application,
but there are many ways to approach it.

Let's say you want to add the style sheet to an existing `App` component. Here's
how to do that:

```diff
// src/app.tsx

import { styleSheet } from "./css";

export function App() {
-  return <HomePage />;
+  return (
+    <>
+      <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
+      <HomePage />
+    </>
+  );
}
```

The key here is to call the `styleSheet` function and insert the CSS string it
returns into the document (in a `<style>` element).

<!-- prettier-ignore-start -->
> [!NOTE]
> Don't worry about the use of React's `dangerouslySetInnerHTML` prop above: Its
> scary name is intended to discourage adding _untrusted_ content to the document.
<!-- prettier-ignore-end -->

For more examples specific to various frameworks, see the
[Quickstart](../quickstart/index.md) section.

## Ready to use

Now you're all set to use the `css` function in your components. Proceed to the
[Usage](../usage/index.md) guide to learn how it works.
