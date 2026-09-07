---
title: Solid
description: Add CSS Hooks to a new Solid project.
order: 3
---

# Quickstart: Solid

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template solid-ts
cd css-hooks-playground
```

## 2. Upgrade to Solid 2

The Vite `solid-ts` template targets Solid 1, but `@css-hooks/solid` v4 targets
Solid 2. Replace the Solid 1 plugin and packages with their Solid 2 equivalents:

```bash
npm uninstall vite-plugin-solid
npm install solid-js@next @solidjs/web@next
npm install -D @solidjs/vite-plugin
```

Then replace the Solid 1 Vite plugin:

```diff
// vite.config.ts

 import { defineConfig } from "vite";
-import solid from "vite-plugin-solid";
+import solid from "@solidjs/vite-plugin";

 export default defineConfig({
   plugins: [solid()],
 });
```

Point `jsxImportSource` at Solid 2:

```diff
// tsconfig.app.json

-    "jsxImportSource": "solid-js",
+    "jsxImportSource": "@solidjs/web",
```

## 3. Install CSS Hooks

```bash
npm install @css-hooks/solid@next remeda
```

## 4. Define a hook

Create a module for styling utilities:

```typescript
// src/css.ts

import { createHooks } from "@css-hooks/solid";

export const { on, styleSheet } = createHooks("&:active");
```

## 5. Render the generated stylesheet

Render `styleSheet()` once at the application root:

```tsx
// src/index.tsx

import { render } from "@solidjs/web";

import App from "./App";
import { styleSheet } from "./css";

render(
  () => (
    <>
      <style innerHTML={styleSheet()} />
      <App />
    </>
  ),
  document.getElementById("root")!,
);
```

## 6. Apply an override style

Use the registered `&:active` hook in a component:

```tsx
// src/App.tsx

import { pipe } from "remeda";

import { on } from "./css";

export default function App() {
  return (
    <button
      style={pipe(
        { transition: "transform 75ms" },
        on("&:active", { transform: "scale(0.9)" }),
      )}
    >
      Press me
    </button>
  );
}
```

Run `npm run dev` to try it. Continue to
[Configuration](../../configuration/index.md) to define more hooks, then see
[Usage](../../usage/index.md) for composition patterns.
