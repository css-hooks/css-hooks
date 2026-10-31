---
title: Preact
description: Create a minimal Preact app with CSS Hooks.
order: 2
---

# Quickstart: Preact

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template preact-ts
cd css-hooks-playground
```

## 2. Install CSS Hooks

```bash
npm install @css-hooks/preact@next
```

## 3. Create the styling module

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/preact";

export const { on, styleSheet } = createHooks("&:hover");

export { mergeStyles };
```

## 4. Render the stylesheet

```diff
// src/main.tsx

 import { render } from 'preact'
-import './index.css'
 import { App } from './app.tsx'
+import { styleSheet } from './css'

-render(<App />, document.getElementById('app')!)
+render(
+  <>
+    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
+    <App />
+  </>,
+  document.getElementById('app')!,
+)
```

## 5. Create a hover effect

Replace the contents of `src/app.tsx` with the following:

```tsx
// src/app.tsx

import { on } from "./css";

export function App() {
  return <button style={on("&:hover", { color: "red" })}>Hover me</button>;
}
```

## 6. View the result

```bash
npm run dev
```

By default, the development server is accessible at http://localhost:5173.

## Next steps

Continue to [Hooks and conditions](../../hooks-and-conditions/index.md) to
declare more hooks, then read [Applying styles](../../applying-styles/index.md)
for composition patterns.
