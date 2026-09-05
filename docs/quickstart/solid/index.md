---
title: Solid
description: Add CSS Hooks to a new Solid project.
order: 3
---

# Quickstart: Solid

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template solid-ts
cd css-hooks-playground
npm install @css-hooks/solid remeda
```

## 2. Define a hook

Create `src/css.ts`:

```typescript
import { createHooks } from "@css-hooks/solid";

export const { on, styleSheet } = createHooks("&:active");
```

## 3. Render the generated stylesheet

Render `styleSheet()` once at the application root. In `src/index.tsx`:

```tsx
import { render } from "solid-js/web";

import App from "./App";
import { styleSheet } from "./css";

render(
  () => (
    <>
      <style innerHTML={styleSheet()} />
      <App />
    </>
  ),
  document.getElementById("root")!,
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
