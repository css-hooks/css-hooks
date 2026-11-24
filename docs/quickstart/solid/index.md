---
title: Solid
description: Create a minimal Solid app with CSS Hooks.
order: 3
---

# Quickstart: Solid

## 1. Create the project

<!-- quickstart: create -->

```bash
npm create solid@latest css-hooks-playground -- --solid --template bare --ts --no-devtools
cd css-hooks-playground
```

<!-- /quickstart -->

## 2. Install CSS Hooks

<!-- quickstart: install -->

```bash
npm install @css-hooks/solid@next
```

<!-- /quickstart -->

## 3. Create the styling module

<!-- quickstart: css.ts -->

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/solid";

export const { on, styleSheet } = createHooks("&:hover");

export { mergeStyles };
```

<!-- /quickstart -->

## 4. Render the stylesheet

<!-- quickstart: Document.patch -->

```diff
// src/Document.tsx

 import type { ParentProps } from 'solid-js';
 import { HydrationScript } from '@solidjs/web';
+import { styleSheet } from './css';

 // The document shell (the index.html replacement), picked up by the
 // src/Document.* convention; it must render the full <html> and ships no
 // client JS. <HydrationScript /> is stripped from the prerendered shell in
 // client mode and activates under `ssr: true`. Delete this file to fall
 // back to the plugin's built-in shell.
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

By default, the development server is accessible at http://localhost:3000.

## Next steps

Continue to [Hooks and conditions](../../hooks-and-conditions/index.md) to
declare more hooks, then read [Applying styles](../../applying-styles/index.md)
for composition patterns.
