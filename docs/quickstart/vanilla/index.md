---
title: No framework
description: Add CSS Hooks to a new vanilla TypeScript project.
order: 99
---

# Quickstart: No framework

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template vanilla-ts
cd css-hooks-playground
npm install @css-hooks/core remeda
```

## 2. Define a hook

Create `src/css.ts`:

```typescript
import { buildHooksSystem } from "@css-hooks/core";

const createHooks = buildHooksSystem();

export const { on, styleSheet } = createHooks("&:active");
```

## 3. Render the generated stylesheet

Add the stylesheet to the document once, near the application entry point:

```typescript
import { styleSheet } from "./css";

const style = document.createElement("style");
style.textContent = styleSheet();
document.head.append(style);
```

## 4. Apply an override style

The core package returns a style object. Your renderer must convert that object
to an inline style string. This minimal example only supports the string values
used below; use a renderer-appropriate serializer in an application.

```typescript
import { pipe } from "remeda";

import { on } from "./css";

function styleObjectToString(style: Record<string, string>) {
  return Object.entries(style)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");
}

const buttonStyle = pipe(
  { transition: "transform 75ms" },
  on("&:active", { transform: "scale(0.9)" }),
);

document
  .querySelector<HTMLButtonElement>("#button")!
  .setAttribute("style", styleObjectToString(buttonStyle));
```

Run `npm run dev` to try it. Continue to
[Configuration](../../configuration/index.md) to define more hooks, then see
[Usage](../../usage/index.md) for composition patterns.
