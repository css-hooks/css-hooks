---
title: v4
description: Upgrading your app from v3 to v4
order: 0
hidden: true
---

# Migrating to v4

Apps using a framework integration can upgrade without changing their CSS Hooks
code, but `@css-hooks/core` has an updated setup API and some framework
integrations have updated compatibility requirements.

## Core setup

`buildHooksSystem` has been renamed to `createHooksSystem`. It now returns an
object containing `createHooks` and `mergeStyles`, rather than returning
`createHooks` directly. Destructure the functions your integration needs from
the result:

```typescript
// v3
import { buildHooksSystem } from "@css-hooks/core";

const createHooks = buildHooksSystem<CSSProperties>(stringify);

// v4
import { createHooksSystem } from "@css-hooks/core";

const { createHooks, mergeStyles } =
  createHooksSystem<CSSProperties>(stringify);
```

The new `mergeStyles` function is bound to the same CSS properties type as
`createHooks` and preserves contextual style inference when it is used in a
pipeline.

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
pipe({ marginTop: 0 }, on("&:hover", { marginTop: 8 }));
```

Protection includes shorthand and longhand properties, physical and logical
equivalents, aliases, and conflicts across multiple `on` calls. Because some of
these declarations only overlap in certain writing modes, the check is
intentionally conservative; prefer using a consistent property throughout a
pipeline.

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
