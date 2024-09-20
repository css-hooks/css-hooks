---
title: React
description: Get up and running with React in a few simple steps.
order: 1
---

# Quickstart: React

## 1. Initialize project

```bash
npm create vite@latest css-hooks-playground -- --template react-ts
cd css-hooks-playground
npm install @css-hooks/react remeda
```

## 2. Start dev server

```bash
npm run dev
```

Visit http://localhost:5173 to view changes in real time.

## 3. Set up CSS Hooks

Create a `src/css.ts` module with the following contents:

```typescript
import { createHooks } from "@css-hooks/react";

export const { styleSheet, on } = createHooks("&:active");
```

## 4. Add style sheet

Modify `src/main.tsx` to add the style sheet to the document:

<!-- prettier-ignore-start -->

```diff
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
+import { styleSheet } from './css.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
+    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </React.StrictMode>,
)
```

<!-- prettier-ignore-end -->

## 5. Add conditional style

Use the configured `&:active` hook to implement an effect when the counter
button is pressed:

<!-- prettier-ignore-start -->

```diff
// src/App.tsx

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
+import { css } from './css.ts'
+import { pipe } from 'remeda'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
-        <button onClick={() => setCount((count) => count + 1)}>
+        <button
+          onClick={() => setCount((count) => count + 1)}
+          style={pipe(
+            {
+              transition: "transform 75ms",
+            },
+            on("&:active", {
+              transform: "scale(0.9)"
+            })
+          )}
+        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```

<!-- prettier-ignore-end -->
