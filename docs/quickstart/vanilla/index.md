---
title: "Quickstart: No framework"
order: 1
---

# Quickstart: No framework

## 1. Initialize project

```bash
npm create vite@latest css-hooks-playground -- --template vanilla-ts
cd css-hooks-playground
npm install && npm install -D @css-hooks/core
```

## 2. Start dev server

```bash
npm run dev
```

Visit http://localhost:5173 to view changes in real time.

## 3. Set up CSS Hooks

Create a `src/css.ts` module with the following contents:

```typescript
import { buildHooksSystem } from "@css-hooks/core";

const createHooks = buildHooksSystem();

export const { styleSheet, css } = createHooks({
  hooks: {
    "&:active": "&:active",
  },
  debug: import.meta.env.PROD,
});

/**
 * Converts a style object to a string.
 *
 * @remarks
 * This functionality (or equivalent) would typically be bundled with an app framework.
 */
export function styleObjectToString(obj: Record<string, unknown>) {
  return Object.entries(obj)
    .filter(
      ([, value]) => typeof value === "string" || typeof value === "number",
    )
    .map(
      ([property, value]) =>
        `${property.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`)}: ${value}`,
    )
    .join("; ");
}
```

## 4. Add style sheet

Modify `src/main.ts` to add the style sheet to the document:

<!-- prettier-ignore-start -->

```diff
import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
+import { styleSheet } from './css.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
+  <style>${styleSheet()}</style>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
```

<!-- prettier-ignore-end -->

## 5. Add conditional style

Use the configured `&:active` hook to implement an effect when the counter
button is pressed:

<!-- prettier-ignore-start -->

```diff
// src/main.ts

import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
-import { styleSheet } from './css.ts'
+import { css, styleObjectToString, styleSheet } from './css.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <style>${styleSheet()}</style>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
-      <button id="counter" type="button"></button>
+      <button
+        id="counter"
+        type="button"
+        style="${styleObjectToString(
+          css({
+            transition: 'transform 75ms',
+            match: (on) => [
+              on('&:active', {
+                transform: 'scale(0.9)',
+              }),
+            ],
+          })
+        )}">
+      </button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
```

<!-- prettier-ignore-end -->
