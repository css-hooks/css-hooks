---
title: Qwik
description: Get up and running with Qwik in a few simple steps.
order: 4
---

# Quickstart: Qwik

## 1. Initialize project

```bash
npm create vite@latest css-hooks-playground -- --template qwik-ts
cd css-hooks-playground
npm install && npm install @css-hooks/qwik
```

## 2. Start dev server

```bash
npm run dev
```

Visit http://localhost:5173 to view changes in real time.

## 3. Set up CSS Hooks

Create a `src/css.ts` module with the following contents:

```typescript
import { createHooks } from "@css-hooks/qwik";

export const { styleSheet, css } = createHooks({
  hooks: {
    "&:active": "&:active",
  },
  debug: import.meta.env.DEV,
});
```

## 4. Add style sheet

Modify `src/main.tsx` to add the style sheet to the document:

<!-- prettier-ignore-start -->

```diff
import '@builder.io/qwik/qwikloader.js'

import { render } from '@builder.io/qwik'
import { App } from './app.tsx'
import './index.css'
+import { styleSheet } from './css.ts'

-render(document.getElementById('app') as HTMLElement, <App />)
+render(
+  document.getElementById('app') as HTMLElement,
+  <>
+    <style dangerouslySetInnerHTML={styleSheet()} />
+    <App />
+  </>
+)
```

<!-- prettier-ignore-end -->

## 5. Add conditional style

Use the configured `&:active` hook to implement an effect when the counter
button is pressed:

<!-- prettier-ignore-start -->

```diff
// src/app.tsx

import { component$, useSignal } from '@builder.io/qwik'

import qwikLogo from './assets/qwik.svg'
import viteLogo from '/vite.svg'
import './app.css'
+import { css } from './css.ts'

export const App = component$(() => {
  const count = useSignal(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://qwik.builder.io" target="_blank">
          <img src={qwikLogo} className="logo qwik" alt="Qwik logo" />
        </a>
      </div>
      <h1>Vite + Qwik</h1>
      <div className="card">
-        <button onClick$={() => count.value++}>count is {count.value}</button>
+        <button
+          onClick$={() => count.value++}
+          style={css({
+            transition: "transform 75ms",
+            match: (on) => [
+              on("&:active", {
+                transform: "scale(0.9)",
+              }),
+            ],
+          })}
+        >
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and Qwik logos to learn more
      </p>
    </>
  )
})
```

<!-- prettier-ignore-end -->
