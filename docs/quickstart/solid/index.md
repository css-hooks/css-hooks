---
title: "Quickstart: Solid"
order: 1
---

# Quickstart: Solid

## 1. Initialize project

```bash
npx degit solidjs/templates/ts css-hooks-playground
cd css-hooks-playground
npm install && npm install @css-hooks/solid
```

## 2. Start dev server

```bash
npm run dev
```

Visit http://localhost:3000 to view changes in real time.

## 3. Set up CSS Hooks

Create a `src/css.ts` module with the following contents:

```typescript
import { createHooks } from "@css-hooks/solid";

export const { styleSheet, css } = createHooks({
  hooks: {
    "&:hover": "&:hover",
  },
  debug: import.meta.env.DEV,
});
```

## 4. Add style sheet

Modify `src/index.ts` to add the style sheet to the document:

<!--prettier-ignore-start-->

```diff
/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
+import { styleSheet } from './css';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

-render(() => <App />, root!);
+render(
+  () => (
+    <>
+      <style innerHTML={styleSheet()} />
+      <App />
+    </>
+  ),
+  root!
+);
```

<!--prettier-ignore-end-->

## 5. Add conditional style

Use the configured `&:hover` hook to implement a hover effect on the Solid logo:

<!-- prettier-ignore-start -->

```diff
// src/App.tsx

import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
-        <img src={logo} class={styles.logo} alt="logo" />
+        <img
+          src={logo}
+          class={styles.logo}
+          style={css({
+            "pointer-events": "unset",
+            match: on => [
+              on("&:hover", {
+                "animation-duration": "1s"
+              })
+            ]
+          })}
+          alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
    </div>
  );
};

export default App;
```

<!-- prettier-ignore-end -->
