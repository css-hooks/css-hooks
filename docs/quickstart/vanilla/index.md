---
title: No framework
description: Create a minimal TypeScript app with CSS Hooks.
order: 99
---

# Quickstart: No framework

## 1. Create the project

```bash
npm create vite@latest css-hooks-playground -- --template vanilla-ts
cd css-hooks-playground
```

## 2. Install CSS Hooks

```bash
npm install @css-hooks/core@next csstype
```

## 3. Create the styling module

```typescript
// src/css.ts

import { createHooksSystem } from "@css-hooks/core";
import type { PropertiesHyphen } from "csstype";

const { createHooks, mergeStyles } =
  createHooksSystem<PropertiesHyphen<string>>();

export const { on, styleSheet } = createHooks("&:hover");

/** Converts a style object to a string. */
export function styleObjectToString(style: PropertiesHyphen<string>) {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");
}

export { mergeStyles };
```

## 4. Create a button

Replace the contents of `src/main.ts` with the following:

```typescript
// src/main.ts

document.querySelector("#app")!.innerHTML = "<button>Hover me</button>";
```

## 5. Render the stylesheet

```diff
// src/main.ts

+import { styleSheet } from "./css";
+
+const style = document.createElement("style");
+style.textContent = styleSheet();
+document.head.append(style);
+
 document.querySelector("#app")!.innerHTML = "<button>Hover me</button>";
```

## 6. Create a hover effect

```diff
// src/main.ts

-import { styleSheet } from "./css";
+import { on, styleObjectToString, styleSheet } from "./css";

 const style = document.createElement("style");
 style.textContent = styleSheet();
 document.head.append(style);

 document.querySelector("#app")!.innerHTML = "<button>Hover me</button>";
+
+document
+  .querySelector("button")!
+  .setAttribute("style", styleObjectToString(on("&:hover", { color: "red" })));
```

## 7. View the result

```bash
npm run dev
```

By default, the development server is accessible at http://localhost:5173.

## Next steps

Continue to [Hooks and conditions](../../hooks-and-conditions/index.md) to
declare more hooks, then read [Applying styles](../../applying-styles/index.md)
for composition patterns.
