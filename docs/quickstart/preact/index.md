---
title: Preact
description: Adding CSS Hooks to a Preact project
order: 2
---

# Quickstart: Preact

This guide shows how to add CSS Hooks to a Preact project.

## 1. Create the project

Create a Preact app with Vite. If you already have a project, continue to
step 2.

```bash
npm create vite@latest css-hooks-playground -- --template preact-ts
cd css-hooks-playground
```

## 2. Install CSS Hooks

```bash
npm install @css-hooks/preact@next
```

## 3. Define a hook

Create `src/css.ts` to export shared styling utilities.

```typescript
// src/css.ts

import { createHooks, mergeStyles } from "@css-hooks/preact";

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

import { render } from "preact";

import { App } from "./app";
import { styleSheet } from "./css";

render(
  <>
    <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
    <App />
  </>,
  document.getElementById("app")!,
);
```

## 5. Apply an override style

Use the declared `&:active` hook in a component. The `mergeStyles` function
combines the base style with the pressed style, so the button shrinks while you
press it.

```tsx
// src/app.tsx

import { mergeStyles, on } from "./css";

export function App() {
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

## 6. View the result

Start the development server and view the application in your browser to see the
result.

If you used Vite, start the development server using the following command:

```bash
npm run dev
```

By default, the development server is accessible at http://localhost:5173.

## Next steps

Continue to [Hooks and conditions](../../hooks-and-conditions/index.md) to
declare more hooks, then read [Applying styles](../../applying-styles/index.md)
for composition patterns.
