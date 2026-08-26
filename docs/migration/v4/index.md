---
title: v3 -> v4
description: Update your app to version 4 of CSS Hooks.
order: 0
---

# Migrating to v4

v4 makes no changes to the public runtime API, so most apps can upgrade without
changing any code.

## Property conflict protection

The React, Preact, Qwik, and Solid integrations now use TypeScript to prevent
conflicting CSS declarations across base and conditional styles. For example, v3
allowed a shorthand and one of its longhands to be mixed:

```typescript
pipe({ margin: 0 }, on("&:hover", { marginTop: 8 }));
```

This can produce unexpected results because the declarations can overwrite one
another. In v4, it is a type error. Use the same property for the base and
conditional values instead:

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
