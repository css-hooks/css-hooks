---
title: React
description: Adding CSS Hooks to a React project
order: 1
---

# Quickstart: React

This guide adds CSS Hooks to a new or existing React project. The finished
button shrinks while you press it. You need Node.js and npm.

## 1. Create or open the project

Create a React app with Vite. If you already have a project, continue to step 2.

```bash
npm create vite@latest css-hooks-playground -- --template react-ts
cd css-hooks-playground
```

## 2. Install CSS Hooks

```bash
npm install @css-hooks/react@next
```

## 3. Define a hook

Create `src/css.ts` to export shared styling utilities.

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/react";

export { mergeStyles };
export const { on, styleSheet } = createHooks("&:active");
```

`createHooks()` declares `&:active` and returns the `on` and `styleSheet`
functions.

## 4. Render the stylesheet

Render `styleSheet()` once at the application root. The stylesheet evaluates the
declared hook.

```tsx
// src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { styleSheet } from "./css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </StrictMode>,
);
```

## 5. Apply an override style

Use the declared `&:active` hook in a component. The `mergeStyles` function
combines the base style with the active style, so the button shrinks while you
press it.

```tsx
// src/App.tsx

import { mergeStyles, on } from "./css";

export default function App() {
  return (
    <button
      style={mergeStyles(
        { transition: "transform 75ms" },
        on("&:active", { transform: "scale(0.9)" }),
      )}
    >
      Press me
    </button>
  );
}
```

If you created a Vite project, run `npm run dev` to view the result. Continue to
[Hooks and conditions](../../hooks-and-conditions/index.md) to declare more
hooks, then read [Applying styles](../../applying-styles/index.md) for
composition patterns.
