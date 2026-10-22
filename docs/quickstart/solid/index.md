---
title: Solid
description: Adding CSS Hooks to a Solid project
order: 3
---

# Quickstart: Solid

This guide shows how to add CSS Hooks to a Solid project.

## 1. Create the project

Create a Solid app with Vite. If you already have a project, continue to step 2.

```bash
npm create vite@latest css-hooks-playground -- --template solid-ts
cd css-hooks-playground
```

## 2. Use Solid v2

The Vite `solid-ts` template targets Solid v1, but `@css-hooks/solid` v4
requires Solid v2. If your project already uses Solid v2, continue to step 3.
Otherwise, replace the Solid v1 plugin and packages with their Solid v2
equivalents.

```bash
npm uninstall vite-plugin-solid
npm install solid-js@next @solidjs/web@next
npm install -D @solidjs/vite-plugin
```

Replace the Solid v1 Vite plugin.

```diff
// vite.config.ts

 import { defineConfig } from "vite";
-import solid from "vite-plugin-solid";
+import solid from "@solidjs/vite-plugin";

 export default defineConfig({
   plugins: [solid()],
 });
```

Set `jsxImportSource` to Solid v2.

```diff
// tsconfig.app.json

-    "jsxImportSource": "solid-js",
+    "jsxImportSource": "@solidjs/web",
```

## 3. Install CSS Hooks

```bash
npm install @css-hooks/solid@next
```

## 4. Define a hook

Create `src/css.ts` to export shared styling utilities.

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/solid";

export { mergeStyles };
export const { on, styleSheet } = createHooks("&:active");
```

`createHooks()` declares `&:active` and returns the `on` and `styleSheet`
functions.

## 5. Render the stylesheet

Render `styleSheet()` once at the application root. The stylesheet evaluates the
declared hook.

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

Use the declared `&:active` hook in a component. The `mergeStyles` function
combines the base style with the active style, so the button shrinks while you
press it.

```tsx
// src/App.tsx

import { mergeStyles, on } from "./css";

export default function App() {
  return (
    <button
      style={mergeStyles(
        { transition: "transform 75ms" },
        on("&:active", { transform: "scale(0.9)" }),
      )}
    >
      Press me
    </button>
  );
}
```

## 7. View the result

Start the development server and view the application in your browser to see the
result.

If you used Vite, start the development server using the following command:

```bash
npm run dev
```

By default, the development server is accessible at http://localhost:5173.

## Next steps

Continue to [Hooks and conditions](../../hooks-and-conditions/index.md) to
declare more hooks, then read [Applying styles](../../applying-styles/index.md)
for composition patterns.
