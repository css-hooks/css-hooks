---
title: Setup
description: Add CSS Hooks to an existing or custom application.
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
npm install @css-hooks/react remeda # remeda optional; see below
```

The available integration packages are:

- `@css-hooks/react`
- `@css-hooks/preact`
- `@css-hooks/solid`
- `@css-hooks/qwik`

For another framework, install `@css-hooks/core` and provide the conversion from
a style object to the format expected by your renderer.

```bash
npm install @css-hooks/core remeda # remeda optional; see below
```

## Choose a pipeline utility

CSS Hooks is designed to compose base styles and override styles through a
pipeline. We recommend Remeda's `pipe`, but any compatible pipeline utility will
work.

| Library                                                                  | Pipeline utility                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Remeda](https://remedajs.com/)                                          | [`pipe`](https://remedajs.com/docs/#pipe)                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [Effect](https://effect.website/)                                        | [`pipe`](https://effect.website/docs/data-types/Function/#pipe)                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [ts-functional-pipe](https://biggyspender.github.io/ts-functional-pipe/) | [`pipeInto`](https://biggyspender.github.io/ts-functional-pipe/modules.html#pipeInto)                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| No library                                                               | [`pipe`](https://www.typescriptlang.org/play?#code/C4TwDgpgBACglpAYgVwHYGNhwPaoDwCSqYywANFAPKknAB8UAvFABRzGkBcURtAlEwbVgtANwAocRAAeYbACdgUAGZpMOVFDAIIeAIJ0WANwCGAG2QRuevtYky5ilWqy4tO-RQBCh0xatQehTKqNzwSC4anlA+tjH2sgpKqhiumtqQ0V4UAMKG4lBQfpbWZAUqqACMYTooqVFBMXRlhSEATDUR9bh42VB5ZXE5CY7JkW4Zuo19ORQAIvmFxQFB5SHVsLXj+NPNa6gdm13qPTN7ragAzJ0QdSf4s1ALg9xzI0nO3ek6LOXL3GgANaobAAd1QLSgADoYSl7gBnazyeQmEB4YzmEpQVAQIwQeQCRgMIEg8F0cRxElgzQAb3K8ggwGQ8k0cLS8KhDIAJsh0BAWCwGfDkGZyBVCQwQoKIMLRVATPDsbj8XwKMs+BIAL7iIA) |

## Create the hooks module

Create a module, commonly `src/css.ts`, that exports the hooks used throughout
your application. Framework integrations export `createHooks` directly:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/react";

export const { on, styleSheet } = createHooks("&:hover");
```

When using the core package, create the `createHooks` function first:

```typescript
// src/css.ts

import { buildHooksSystem } from "@css-hooks/core";

const createHooks = buildHooksSystem();

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

Framework integrations use their own mechanism to render the same string. The
[Quickstart](../quickstart/index.md) guides show the appropriate placement for
each supported framework.

Continue to [Configuration](../configuration/index.md) to define hooks, then
read [Usage](../usage/index.md) to apply base styles and override styles.
