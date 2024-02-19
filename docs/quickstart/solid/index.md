---
title: Solid
description: Get up and running with Solid in a few simple steps.
order: 3
---

# Quickstart: Solid

## 1. Initialize project

```bash
npm create vite@latest css-hooks-playground -- --template solid-ts
cd css-hooks-playground
npm install && npm install @css-hooks/solid
```

## 2. Start dev server

```bash
npm run dev
```

Visit http://localhost:5173 to view changes in real time.

## 3. Set up CSS Hooks

Create a `src/css.ts` module with the following contents:

```typescript
import { createHooks } from "@css-hooks/solid";

export const { styleSheet, css } = createHooks({
  hooks: {
    "&:active": "&:active",
  },
  debug: import.meta.env.DEV,
});
```

## 4. Add style sheet

Modify `src/index.tsx` to add the style sheet to the document:

<!-- prettier-ignore-start -->

```diff
/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
+import { styleSheet } from './css'

const root = document.getElementById('root')

-render(() => <App />, root!)
+render(
+  () => (
+    <>
+      <style innerHTML={styleSheet()} />
+      <App />
+    </>
+  ),
+  root!
+)
```

<!-- prettier-ignore-end -->

## 5. Add conditional style

Use the configured `&:active` hook to implement an effect when the counter
button is pressed:

<!-- prettier-ignore-start -->

```diff
// src/App.tsx

import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
+import { css } from './css'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} className="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div className="card">
-        <button onClick={() => setCount((count) => count + 1)}>
+        <button
+          onClick={() => setCount((count) => count + 1)}
+          style={css({
+            transition: "transform 75ms",
+            on: $ => [
+              $("&:active", {
+                transform: "scale(0.9)"
+              })
+            ]
+          })}
+        >
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  )
}

export default App
```

<!-- prettier-ignore-end -->
