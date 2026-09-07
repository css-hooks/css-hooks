---
title: Qwik
description: Add CSS Hooks to a new Qwik project.
order: 4
---

# Quickstart: Qwik

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template qwik-ts
cd css-hooks-playground
```

## 2. Upgrade to Qwik 2

The Vite `qwik-ts` template ships Qwik 1, which does not support Vite 8. Replace
it with Qwik 2 and install CSS Hooks:

```bash
npm uninstall @builder.io/qwik
npm install @css-hooks/qwik@next @qwik.dev/core remeda
```

Then replace the Qwik 1 optimizer import:

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

Point `jsxImportSource` at Qwik 2:

```diff
// tsconfig.app.json

-    "jsxImportSource": "@builder.io/qwik",
+    "jsxImportSource": "@qwik.dev/core",
```

## 3. Define a hook

Create a module for styling utilities:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/qwik";

export const { on, styleSheet } = createHooks("&:active");
```

## 4. Render the generated stylesheet

Render `styleSheet()` once at the application root:

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

Use the registered `&:active` hook in a component:

```tsx
// src/app.tsx

import { component$ } from "@qwik.dev/core";
import { pipe } from "remeda";

import { on } from "./css";

export const App = component$(() => (
  <button
    style={pipe(
      { transition: "transform 75ms" },
      on("&:active", { transform: "scale(0.9)" }),
    )}
  >
    Press me
  </button>
));
```

Run `npm run dev` to try it. Continue to
[Configuration](../../configuration/index.md) to define more hooks, then see
[Usage](../../usage/index.md) for composition patterns.
