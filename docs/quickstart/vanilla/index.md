---
title: No framework
description: Add CSS Hooks to a vanilla TypeScript project
order: 99
---

# Quickstart: No framework

This guide adds CSS Hooks to a new or existing vanilla TypeScript project. The
finished button shrinks while you press it. You need Node.js and npm.

## 1. Create or open the project

Create a vanilla TypeScript app with Vite. If you already have a project,
continue to step 2.

```bash
npm create vite@latest css-hooks-playground -- --template vanilla-ts
cd css-hooks-playground
```

## 2. Install CSS Hooks

```bash
npm install @css-hooks/core@next
```

## 3. Define a hook

Create `src/css.ts` to export shared styling utilities.

```typescript
// src/css.ts

import { createHooksSystem } from "@css-hooks/core";

const { createHooks, mergeStyles } = createHooksSystem();

export { mergeStyles };
export const { on, styleSheet } = createHooks("&:active");
```

`createHooksSystem()` provides renderer-independent styling utilities.
`createHooks()` declares `&:active` and returns the `on` and `styleSheet`
functions.

## 4. Render the stylesheet

Add the stylesheet to the document once near the application entry point. The
stylesheet evaluates the declared hook.

```typescript
// src/main.ts

import { styleSheet } from "./css";

const style = document.createElement("style");
style.textContent = styleSheet();
document.head.append(style);
```

## 5. Apply an override style

Convert the style object from the core package to an inline style string. This
example only supports the string values in this example. In an application, use
a serializer designed for your renderer.

```typescript
// src/main.ts

import { mergeStyles, on } from "./css";

function styleObjectToString(style: Record<string, string>) {
  return Object.entries(style)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");
}

const buttonStyle = mergeStyles(
  { transition: "transform 75ms" },
  on("&:active", { transform: "scale(0.9)" }),
);

document
  .querySelector<HTMLButtonElement>("#button")!
  .setAttribute("style", styleObjectToString(buttonStyle));
```

The `mergeStyles` function combines the base style with the active style, so the
button shrinks while you press it.

If you created a Vite project, run `npm run dev` to view the result. Continue to
[Hooks and conditions](../../hooks-and-conditions/index.md) to declare more
hooks, then read [Applying styles](../../applying-styles/index.md) for
composition patterns.
