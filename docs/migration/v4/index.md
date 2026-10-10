---
title: v4
description: Upgrading your app from v3 to v4
order: 0
hidden: true
---

# Migrating to v4

CSS Hooks v4 makes conditional styles serializable, removes the need for a
third-party pipeline utility, and adds property conflict protection.

This guide explains how to migrate a v3 application. Before you begin, identify
every style pipeline, check your framework version, and determine whether your
application imports `@css-hooks/core` directly. For most applications, replace
`pipe` with `mergeStyles`. Hook definitions and stylesheet setup remain
unchanged.

Direct consumers of `@css-hooks/core` (advanced use cases) require minor updates
to the setup API. After the migration, conditional styles will be serializable,
and supported framework integrations will report property conflicts in
TypeScript.

## Agent prompt

Copy this prompt into a coding agent to perform the migration:

> ```text
> Migrate this project from CSS Hooks v3 to v4.
>
> Use this migration guide:
> https://next.css-hooks.com/docs/migration/v4/
>
> In particular:
>
> - Find `pipe` or `pipeInto` calls that combine style objects with `on(...)` transforms, including reusable values later passed to a `style` prop. Replace those calls with `mergeStyles`, preserving argument order.
> - Export `mergeStyles` from the project's styling module.
> - Do not replace unrelated uses of `pipe` or remove a pipeline dependency that is still used.
> - For direct `@css-hooks/core` usage, migrate `buildHooksSystem` to `createHooksSystem` and destructure the returned functions.
> - Apply the framework compatibility requirements only when relevant.
> - Resolve new property-conflict errors without changing intended styling behavior.
> - Avoid unrelated refactoring or formatting.
>
> Inspect the entire project for affected usage. Update dependencies using the project's existing package manager, run its type checker and tests, and summarize any work that still requires manual review.
> ```

## Style pipelines

In v4, `on` returns a style object instead of a transform function. This change
makes conditional styles serializable, but they no longer work with generic
pipeline utilities. Use `mergeStyles` for composition. Re-export it from your
styling module with your configured hooks:

```typescript
import { createHooks, mergeStyles } from "@css-hooks/react";

export { mergeStyles };
export const { on, styleSheet } = createHooks(/* ... */);
```

This keeps framework imports in your styling module and gives components one
module from which to import `mergeStyles` and `on`.

Replace each CSS Hooks style pipeline with `mergeStyles`:

```diff
-import { pipe } from "remeda";
-import { on } from "./css";
+import { mergeStyles, on } from "./css";

-style={pipe(
+style={mergeStyles(
   { color: "black" },
   on("&:hover", { color: "blue" }),
 )}
```

Keep the base style and conditional styles in the same order as the v3 pipeline.
Unlike the v3 pipeline, `mergeStyles` also accepts ordinary style objects. Pass
an external style object last when it should take precedence over the
component's internal styles.

Remove the pipeline dependency if it has no other uses.

## Core setup

`buildHooksSystem` was renamed to `createHooksSystem`. It now returns an object
containing `createHooks` and `mergeStyles`, rather than returning `createHooks`
directly. Destructure the functions your integration needs from the result:

```diff
-import { buildHooksSystem } from "@css-hooks/core";
+import { createHooksSystem } from "@css-hooks/core";

-const createHooks = buildHooksSystem<CSSProperties>(stringify);
+const { createHooks, mergeStyles } =
+  createHooksSystem<CSSProperties>(stringify);
```

The returned `mergeStyles` function uses the same CSS properties type and value
stringifier as `createHooks`. Use this returned function so both APIs share your
integration's types and serialization behavior.

## Framework compatibility

### Preact

`@css-hooks/preact` supports Preact v11 and requires Preact v10.27.2 or later.
Upgrade Preact before upgrading CSS Hooks if your application uses an earlier
Preact v10 release.

### Solid

`@css-hooks/solid` targets Solid v2 through `@solidjs/web` instead of Solid v1
through `solid-js`. Migrate your application to Solid v2 before upgrading CSS
Hooks. See the [Solid quickstart](../../quickstart/solid/index.md) for the
package, Vite plugin, and TypeScript configuration changes.

### Qwik

`@css-hooks/qwik` targets Qwik v2 through `@qwik.dev/core` instead of Qwik v1
through `@builder.io/qwik`. Migrate your application to Qwik v2 before upgrading
CSS Hooks. See the [Qwik quickstart](../../quickstart/qwik/index.md) for the
package, optimizer import, and TypeScript configuration changes.

## Property conflict protection

v4 adds TypeScript protection against conflicting CSS declarations across base
and override styles. In v3, mixing a shorthand with one of its longhands was
allowed:

```typescript
pipe({ margin: 0 }, on("&:hover", { marginTop: 8 }));
```

This can produce unexpected results because the declarations overwrite one
another. In v4, it is a type error. Use the same property for the base and
override values:

```typescript
mergeStyles({ marginTop: 0 }, on("&:hover", { marginTop: 8 }));
```

For the conflicts the check detects and how to keep your styles compatible, see
[Property conflicts](../../applying-styles/index.md#property-conflicts).
