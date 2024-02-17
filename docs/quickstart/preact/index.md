---
title: Preact
description: Get up and running with Preact in a few simple steps.
order: 2
---

# Quickstart: Preact

## 1. Initialize project

```bash
npm create vite@latest css-hooks-playground -- --template preact-ts
cd css-hooks-playground
npm install && npm install @css-hooks/preact
```

## 2. Start dev server

```bash
npm run dev
```

Visit http://localhost:5173 to view changes in real time.

## 3. Set up CSS Hooks

Create a `src/css.ts` module with the following contents:

```typescript
import { createHooks } from "@css-hooks/preact";

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
import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'
+import { styleSheet } from './css.ts'

-render(<App />, document.getElementById('app')!)
+render(
+  <>
+    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
+    <App />
+  </>,
+  document.getElementById('app')!
+)
```

<!-- prettier-ignore-end -->

## 5. Add conditional style

Use the configured `&:active` hook to implement an effect when the counter
button is pressed:

<!-- prettier-ignore-start -->

```diff
// src/app.tsx

import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
+import { css } from './css.ts'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} className="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>
      <div className="card">
-        <button onClick={() => setCount((count) => count + 1)}>
+        <button
+          onClick={() => setCount((count) => count + 1)}
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
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </>
  )
}
```

<!-- prettier-ignore-end -->
