---
title: React
description: Create a minimal React app with CSS Hooks.
order: 1
---

# Quickstart: React

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template react-ts
cd css-hooks-playground
```

## 2. Install CSS Hooks

```bash
npm install @css-hooks/react@next
```

## 3. Create the styling module

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/react";

export const { on, styleSheet } = createHooks("&:hover");

export { mergeStyles };
```

## 4. Render the stylesheet

```diff
// src/main.tsx

 import { StrictMode } from 'react'
 import { createRoot } from 'react-dom/client'
-import './index.css'
 import App from './App.tsx'
+import { styleSheet } from './css'

 createRoot(document.getElementById('root')!).render(
   <StrictMode>
+    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
     <App />
   </StrictMode>,
 )
```

## 5. Create a hover effect

Replace the contents of `src/App.tsx` with the following:

```tsx
// src/App.tsx

import { on } from "./css";

export default function App() {
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
