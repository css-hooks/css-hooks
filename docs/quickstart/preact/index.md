---
title: Preact
description: Create a minimal Preact app with CSS Hooks.
order: 2
---

# Quickstart: Preact

## 1. Create the project

<!-- quickstart: create -->

```bash
npm create vite@latest css-hooks-playground -- --template preact-ts
cd css-hooks-playground
```

<!-- /quickstart -->

## 2. Install CSS Hooks

<!-- quickstart: install -->

```bash
npm install @css-hooks/preact@next
```

<!-- /quickstart -->

## 3. Create the styling module

<!-- quickstart: css.ts -->

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/preact";

export const { on, styleSheet } = createHooks("&:hover");

export { mergeStyles };
```

<!-- /quickstart -->

## 4. Render the stylesheet

<!-- quickstart: main.patch -->

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

<!-- /quickstart -->

## 5. Create a hover effect

Replace the contents of `src/app.tsx` with the following:

<!-- quickstart: app.tsx -->

```tsx
// src/app.tsx

import { on } from "./css";

export function App() {
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
