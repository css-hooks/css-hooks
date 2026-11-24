---
title: v2
description: Upgrading your app from v1 to v2
order: 2
hidden: true
---

# Migrating to v2

CSS Hooks v2 changes how you configure hooks, render the stylesheet, and apply
conditional styles.

To migrate from v1, update the module that calls `createHooks`, the component
that renders the stylesheet, and calls to the `css` function. Follow the
sections in order.

## Configuration

In v1, `createHooks` accepted hook declarations as its first parameter and
configuration options as its second parameter. In v2, it accepts one
configuration object. Some option defaults also changed.

### Merging hook declarations and configuration options

Pass one object to `createHooks`. Move the hook declarations to its `hooks`
property. Keep the configuration options from the former second parameter as
properties of the same object.

```diff
// src/css.ts

-export const [hooks, css] = createHooks(
-  {
+export const { styleSheet, css } = createHooks({
+  hooks: {
     "&:hover": "&:hover",
   },
-  {
-    fallback: "revert-layer",
-    debug: true,
-  },
-);
+  fallback: "revert-layer",
+  debug: true,
+});
```

The v2 call keeps the same hook and option values, but groups them in one
configuration object. It also uses object destructuring for the new return
value, as described in the [Setup](#setup) section.

### Updating the `fallback` option

In v2, the default value of `fallback` changed from `"unset"` to
`"revert-layer"`. To retain the v1 fallback or support browsers that do not
support `revert-layer`, set `fallback` explicitly:

```typescript
fallback: "unset",
```

### Updating the `sort` option

Remove `sort: true` because v2 enables sorting by default.

To retain behavior closest to the v1 default, disable property and conditional
style sorting:

```typescript
sort: {
  properties: false,
  conditionalStyles: false
}
```

## Setup

In v1, `createHooks` returned a tuple containing a CSS string and the `css`
function. In v2, it returns an object. The stylesheet is also a function instead
of a string.

### Destructuring the `createHooks` return value

Replace array destructuring with object destructuring. Rename the value commonly
called `hooks` to `styleSheet`.

```diff
// src/css.ts

-export const [hooks, css] = createHooks(/* ... */);
+export const { styleSheet, css } = createHooks(/* ... */);
```

Object destructuring selects the v2 `styleSheet` and `css` properties by name.

### Adding the stylesheet

Find the component that renders the stylesheet, such as your root component.
Import `styleSheet` instead of `hooks`. Call `styleSheet()` to produce the CSS
string.

```diff
// src/app.tsx

-import { hooks } from "./css";
+import { styleSheet } from "./css";

 export function App() {
   return (
     <>
-      <style dangerouslySetInnerHTML={{ __html: hooks }} />
+      <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
       <HomePage />
     </>
   );
 }
```

In v2, calling `styleSheet()` constructs the CSS for the configured hooks when
the component renders.

## Updating conditional styles

In v1, nested style objects composed hooks with an implicit "and" operation. In
v2, an `on` callback defines conditional styles and supports "and", "or", and
"not" operations.

Update every `css` call that contains conditional styles. Keep base declarations
in the style object, and return conditional declarations from `on`.

<!--prettier-ignore-start-->
> [!NOTE] To use the previous API with v2, see [css-hooks-basic](https://github.com/nsaunders/css-hooks-basic).
<!--prettier-ignore-end-->

### Basic use case

```diff
 export function Button({ children }) {
   return (
     <button
       style={css({
         color: "blue",
-        "&:hover": {
-          color: "red",
-        },
+        on: $ => [
+          $("&:hover", {
+            color: "red",
+          }),
+        ],
       })}
     >
       {children}
     </button>
   );
 }
```

The `on` callback receives `$`, a function that associates a hook with a style
object. Return an array of these conditional style entries. In this example, the
button remains blue until `&:hover` matches, when it becomes red.

### With compositional nesting

```diff
 export function Button({ children }) {
   return (
     <button
       style={css({
         color: "blue",
-        "&:enabled": {
-          "&:hover": {
+        on: ($, { and }) => [
+          $(and("&:enabled", "&:hover"), {
             color: "red",
-          },
-        },
+          }),
+        ],
       })}
     >
       {children}
     </button>
   );
 }
```

The v1 nesting applies the red text only when both `&:enabled` and `&:hover`
match. The v2 code preserves that behavior by combining the hooks with `and` and
passing the resulting condition to `$`.
