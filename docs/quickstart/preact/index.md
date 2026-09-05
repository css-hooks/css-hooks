---
title: Preact
description: Add CSS Hooks to a new Preact project.
order: 2
---

# Quickstart: Preact

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template preact-ts
cd css-hooks-playground
npm install @css-hooks/preact remeda
```

## 2. Define a hook

Create `src/css.ts`:

```typescript
import { createHooks } from "@css-hooks/preact";

export const { on, styleSheet } = createHooks("&:active");
```

## 3. Render the generated stylesheet

Render `styleSheet()` once at the application root. In `src/main.tsx`:

```tsx
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

## 4. Apply an override style

Use the registered `&:active` hook in a component:

```tsx
import { pipe } from "remeda";

import { on } from "./css";

export function App() {
  return (
    <button
      style={pipe(
        { transition: "transform 75ms" },
        on("&:active", { transform: "scale(0.9)" }),
      )}
    >
      Press me
    </button>
  );
}
```

Run `npm run dev` to try it. Continue to
[Configuration](../../configuration/index.md) to define more hooks, then see
[Usage](../../usage/index.md) for composition patterns.
