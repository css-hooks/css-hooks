---
title: Solid
description: Create a minimal Solid app with CSS Hooks.
order: 3
---

# Quickstart: Solid

## 1. Create the project

```bash
npm create solid@latest css-hooks-playground -- --solid --template bare --ts
cd css-hooks-playground
```

## 2. Install CSS Hooks

```bash
npm install @css-hooks/solid@next
```

## 3. Create the styling module

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/solid";

export const { on, styleSheet } = createHooks("&:hover");

export { mergeStyles };
```

## 4. Render the stylesheet

```diff
// src/Document.tsx

 import type { ParentProps } from 'solid-js';
 import { HydrationScript } from '@solidjs/web';
+import { styleSheet } from './css';

 export default function Document(props: ParentProps) {
   return (
     <html lang="en">
       <head>
         <meta charset="utf-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="icon" href="/favicon.ico" />
         <title>Solid App</title>
+        <style innerHTML={styleSheet()} />
         <HydrationScript />
       </head>
       <body>{props.children}</body>
     </html>
   );
 }
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

By default, the development server is accessible at http://localhost:3000.

## Next steps

Continue to [Hooks and conditions](../../hooks-and-conditions/index.md) to
declare more hooks, then read [Applying styles](../../applying-styles/index.md)
for composition patterns.
