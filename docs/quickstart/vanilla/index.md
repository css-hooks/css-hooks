---
title: No framework
description: Create a minimal TypeScript app with CSS Hooks.
order: 99
---

# Quickstart: No framework

## 1. Create the project

<!-- quickstart: create -->

```bash
npm create vite@latest css-hooks-playground -- --template vanilla-ts
cd css-hooks-playground
```

<!-- /quickstart -->

## 2. Install CSS Hooks

<!-- quickstart: install -->

```bash
npm install @css-hooks/core@next csstype
```

<!-- /quickstart -->

## 3. Create the styling module

<!-- quickstart: css.ts -->

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

<!-- /quickstart -->

## 4. Create a button

Replace the contents of `src/main.ts` with the following:

<!-- quickstart: main.ts -->

```typescript
// src/main.ts

document.querySelector("#app")!.innerHTML = "<button>Hover me</button>";
```

<!-- /quickstart -->

## 5. Render the stylesheet

<!-- quickstart: main.patch -->

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

<!-- /quickstart -->

## 6. Create a hover effect

<!-- quickstart: main-hover.patch -->

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

<!-- /quickstart -->

## 7. View the result

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
