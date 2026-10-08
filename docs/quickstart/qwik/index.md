---
title: Qwik
description: Adding CSS Hooks to a Qwik project
order: 4
---

# Quickstart: Qwik

This guide adds CSS Hooks to a new or existing Qwik project. The finished button
shrinks while you press it. You need Node.js and npm. The final project uses
Qwik v2.

## 1. Create or open the project

Create a Qwik app with Vite. If you already have a project, continue to step 2.

```bash
npm create vite@latest css-hooks-playground -- --template qwik-ts
cd css-hooks-playground
```

## 2. Use Qwik v2

The Vite `qwik-ts` template uses Qwik v1, which does not support Vite 8. If your
project already uses Qwik v2, run `npm install @css-hooks/qwik@next` and
continue to step 3. Otherwise, replace Qwik v1 with Qwik v2 and install CSS
Hooks.

```bash
npm uninstall @builder.io/qwik
npm install @css-hooks/qwik@next @qwik.dev/core
```

Replace the Qwik v1 optimizer import.

```diff
// vite.config.ts

-import { qwikVite } from "@builder.io/qwik/optimizer";
+import { qwikVite } from "@qwik.dev/core/optimizer";
 import { defineConfig } from "vite";

 export default defineConfig({
   plugins: [
     qwikVite({
       csr: true,
     }),
   ],
 });
```

Set `jsxImportSource` to Qwik v2.

```diff
// tsconfig.app.json

-    "jsxImportSource": "@builder.io/qwik",
+    "jsxImportSource": "@qwik.dev/core",
```

## 3. Define a hook

Create `src/css.ts` to export shared styling utilities.

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/qwik";

export { mergeStyles };
export const { on, styleSheet } = createHooks("&:active");
```

`createHooks()` declares `&:active` and returns the `on` and `styleSheet`
functions.

## 4. Render the stylesheet

Render `styleSheet()` once at the application root. The stylesheet evaluates the
declared hook.

```tsx
// src/main.tsx

import "@qwik.dev/core/qwikloader.js";

import { render } from "@qwik.dev/core";

import { App } from "./app";
import { styleSheet } from "./css";

render(
  document.getElementById("app")!,
  <>
    <style dangerouslySetInnerHTML={styleSheet()} />
    <App />
  </>,
);
```

## 5. Apply an override style

Use the declared `&:active` hook in a component. The `mergeStyles` function
combines the base style with the active style, so the button shrinks while you
press it.

```tsx
// src/app.tsx

import { component$ } from "@qwik.dev/core";

import { mergeStyles, on } from "./css";

export const App = component$(() => (
  <button
    style={mergeStyles(
      { transition: "transform 75ms" },
      on("&:active", { transform: "scale(0.9)" }),
    )}
  >
    Press me
  </button>
));
```

If you created a Vite project, run `npm run dev` to view the result. Continue to
[Hooks and conditions](../../hooks-and-conditions/index.md) to declare more
hooks, then read [Applying styles](../../applying-styles/index.md) for
composition patterns.
