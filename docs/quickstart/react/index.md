---
title: React
description: Add CSS Hooks to a new React project.
order: 1
---

# Quickstart: React

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template react-ts
cd css-hooks-playground
npm install @css-hooks/react remeda
```

## 2. Define a hook

Create `src/css.ts`:

```typescript
import { createHooks } from "@css-hooks/react";

export const { on, styleSheet } = createHooks("&:active");
```

## 3. Render the generated stylesheet

Render `styleSheet()` once at the application root. In `src/main.tsx`:

```tsx
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

## 4. Apply an override style

Use the registered `&:active` hook in a component:

```tsx
import { pipe } from "remeda";

import { on } from "./css";

export default function App() {
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
