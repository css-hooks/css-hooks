---
title: React
description: Create a minimal React app with CSS Hooks.
order: 1
---

# Quickstart: React

## 1. Create the project

<!-- quickstart: create -->

```bash
npm create vite@latest css-hooks-playground -- --template react-ts
cd css-hooks-playground
```

<!-- /quickstart -->

## 2. Install CSS Hooks

<!-- quickstart: install -->

```bash
npm install @css-hooks/react@next
```

<!-- /quickstart -->

## 3. Create the styling module

<!-- quickstart: css.ts -->

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/react";

export const { on, styleSheet } = createHooks("&:hover");

export { mergeStyles };
```

<!-- /quickstart -->

## 4. Render the stylesheet

<!-- quickstart: main.patch -->

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

<!-- /quickstart -->

## 5. Create a hover effect

Replace the contents of `src/App.tsx` with the following:

<!-- quickstart: App.tsx -->

```tsx
// src/App.tsx

import { on } from "./css";

export default function App() {
  return <button style={on("&:hover", { color: "red" })}>Hover me</button>;
}
```

<!-- /quickstart -->

## 6. View the result

<!-- quickstart: dev -->

```bash
npm run dev
```

<!-- /quickstart -->

By default, the development server is accessible at http://localhost:5173.

## Next steps

Continue to [Hooks and conditions](../../hooks-and-conditions/index.md) to
declare more hooks, then read [Applying styles](../../applying-styles/index.md)
for composition patterns.
