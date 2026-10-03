---
title: Setup
description: Adding CSS Hooks to an existing or custom application
order: 3
---

# Setup

This guide covers the generic integration path for an existing application or a
framework without a dedicated CSS Hooks package. For a new framework project,
start with the [Quickstart](../quickstart/index.md) instead.

## Install a package

Install the integration package for your framework. For example, a React
application needs:

```bash
npm install @css-hooks/react@next
```

The available integration packages are:

- `@css-hooks/react`
- `@css-hooks/preact`
- `@css-hooks/solid`
- `@css-hooks/qwik`

For another framework, install `@css-hooks/core` and provide the conversion from
a style object to the format expected by your renderer.

```bash
npm install @css-hooks/core@next
```

## Create the styling module

Create a module that exports the hooks used throughout your application. With a
dedicated package, import `createHooks` and `mergeStyles` directly:

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/react";

export { mergeStyles };
export const { on, styleSheet } = createHooks("&:hover");
```

When using the core package, create the `createHooks` function first:

```typescript
// src/css.ts

import { createHooksSystem } from "@css-hooks/core";

const { createHooks, mergeStyles } = createHooksSystem();

export { mergeStyles };
export const { on, styleSheet } = createHooks("&:hover");
```

The selector in this example is only a starting point. Define the hooks your
application needs per the [Configuration](../configuration/index.md) guide.

## Render the stylesheet

Render the generated stylesheet once, near the application root. In a
client-rendered application, this can be as simple as adding a `<style>` element
to the document head:

```typescript
import { styleSheet } from "./css";

const style = document.createElement("style");
style.textContent = styleSheet();
document.head.append(style);
```

Use your framework's preferred mechanism to render the same string. The
[Quickstart](../quickstart/index.md) guides show the appropriate placement for
each supported framework.

Continue to [Configuration](../configuration/index.md) to define hooks, then
read [Usage](../usage/index.md) to apply base styles and override styles.
