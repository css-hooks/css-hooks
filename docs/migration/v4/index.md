---
title: v4
description: Upgrading your app from v3 to v4
order: 0
hidden: true
---

# Migrating to v4

CSS Hooks v4 makes conditional styles serializable, removes the need for a
third-party pipeline utility, and adds property conflict protection.

For most applications, the upgrade is a mechanical replacement of the `pipe`
function with `mergeStyles`; hook definitions and stylesheet setup remain
unchanged. Some framework integration packages have updated compatibility
requirements.

Direct consumers of `@css-hooks/core` (advanced use cases) require minor updates
to their usage of the setup API.

## Style pipelines

To make styles serializable, `on` now returns a style object instead of a
transform function, so it is no longer compatible with generic pipeline
utilities. Instead, use `mergeStyles` for composition. Re-export it from your
styling module alongside your configured hooks:

```typescript
import { createHooks, mergeStyles } from "@css-hooks/react";

export { mergeStyles };
export const { on, styleSheet } = createHooks(/* ... */);
```

Then replace style pipelines with `mergeStyles`:

```diff
-import { pipe } from "remeda";
-import { on } from "./css";
+import { mergeStyles, on } from "./css";

-style={pipe(
+style={mergeStyles(
  { color: "black" },
  on("&:hover", { color: "blue" }),
  externalStyle,
)}
```

Remove the pipeline dependency if it has no other uses, but leave unrelated
pipelines unchanged.

## Core setup

`buildHooksSystem` has been renamed to `createHooksSystem`. It now returns an
object containing `createHooks` and `mergeStyles`, rather than returning
`createHooks` directly. Destructure the functions your integration needs from
the result:

```diff
-import { buildHooksSystem } from "@css-hooks/core";
+import { createHooksSystem } from "@css-hooks/core";

-const createHooks = buildHooksSystem<CSSProperties>(stringify);
+const { createHooks, mergeStyles } =
+  createHooksSystem<CSSProperties>(stringify);
```

The returned `mergeStyles` function uses the same CSS properties type and value
stringifier as `createHooks`.

## Framework compatibility

### Preact

`@css-hooks/preact` now supports Preact v11 and requires Preact v10.27.2 or
later. Upgrade Preact before upgrading CSS Hooks if your app uses an earlier
Preact v10 release.

### Solid

`@css-hooks/solid` now targets Solid v2 through `@solidjs/web` instead of Solid
v1 through `solid-js`. Migrate your app to Solid v2 before upgrading CSS Hooks.
See the [Solid quickstart](../../quickstart/solid/index.md) for the package,
Vite plugin, and TypeScript configuration changes.

### Qwik

`@css-hooks/qwik` now targets Qwik v2 through `@qwik.dev/core` instead of Qwik
v1 through `@builder.io/qwik`. Migrate your app to Qwik v2 before upgrading CSS
Hooks. See the [Qwik quickstart](../../quickstart/qwik/index.md) for the
package, optimizer import, and TypeScript configuration changes.

## Property conflict protection

The React, Preact, Qwik, and Solid integrations now use TypeScript to prevent
conflicting CSS declarations across base and override styles. For example, v3
allowed a shorthand and one of its longhands to be mixed:

```typescript
pipe({ margin: 0 }, on("&:hover", { marginTop: 8 }));
```

This can produce unexpected results because the declarations can overwrite one
another. In v4, it is a type error. Use the same property for the base and
override values instead:

```typescript
mergeStyles({ marginTop: 0 }, on("&:hover", { marginTop: 8 }));
```

Protection includes shorthand and longhand properties, physical and logical
equivalents, and aliases. Because some of these declarations only overlap in
certain writing modes, the check is intentionally conservative; prefer using a
consistent property throughout a `mergeStyles` call.

TypeScript must retain the specific keys in each style object for accurate
checking. If you explicitly annotate a reusable style with a broad framework
type such as `CSSProperties`, use `satisfies` instead:

```typescript
const baseStyle = {
  color: "black",
} satisfies CSSProperties;
```

This protection is compile-time only. JavaScript users and custom integrations
built directly with `@css-hooks/core` do not receive it automatically.
