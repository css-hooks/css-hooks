---
title: Qwik
description: Create a minimal Qwik app with CSS Hooks.
order: 4
---

# Quickstart: Qwik

## 1. Create the project

```bash
npm create qwik@rc empty css-hooks-playground
cd css-hooks-playground
```

## 2. Install CSS Hooks

```bash
npm install @css-hooks/qwik@next
```

## 3. Create the styling module

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/qwik";

export const { on, styleSheet } = createHooks("&:hover");

export { mergeStyles };
```

## 4. Render the stylesheet

```diff
// src/root.tsx

 import { component$ } from "@qwik.dev/core";
 import {
   DocumentHeadTags,
   RouterOutlet,
   useLocation,
   useQwikRouter,
 } from "@qwik.dev/router";

+import { styleSheet } from "./css";
 import "./global.css";

 export default component$(() => {
   useQwikRouter();
   const { url } = useLocation();

   return (
     <>
       <head>
         <meta charset="utf-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

         <DocumentHeadTags />
+        <style dangerouslySetInnerHTML={styleSheet()} />

         <link rel="canonical" href={url.href} />
       </head>
       <body>
         <RouterOutlet />
       </body>
     </>
   );
 });
```

## 5. Create a hover effect

Replace the contents of `src/routes/index.tsx` with the following:

```tsx
// src/routes/index.tsx

import { component$ } from "@qwik.dev/core";

import { on } from "../css";

export default component$(() => (
  <button style={on("&:hover", { color: "red" })}>Hover me</button>
));
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
