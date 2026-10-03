---
title: Light/dark mode with automatic inversion
description:
  Follow the system theme, support explicit overrides, and
  automatically alternate nested panel themes
order: 4
hidden: true
---

# Light/dark mode with automatic inversion

Light and dark modes let an application adapt to a user's
preferred appearance. Similarly, a panel may need to adapt
to its surrounding context by switching to the opposite mode
in order to create visual contrast.

This `ContrastPanel` component demonstrates that approach.
The page follows your system preference by default. Try
selecting Light or Dark to override it, and notice that the
outer panel contrasts with the page while the inner panel
contrasts with the outer panel.

```tsx sandpack
// App.tsx

import type { ReactNode } from "react";
import { useState } from "react";

import { disable, enable, mergeStyles, on } from "./css";

const invertDark = mergeStyles(
  enable("%dark"),
  on("%dark", disable("%dark")),
);

function ContrastPanel({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <section
      style={mergeStyles(
        {
          padding: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#e2e8f0",
          background: "#fff",
          color: "#0f172a",
        },
        on("%dark", {
          borderColor: "#334155",
          background: "#1e293b",
          color: "#f8fafc",
        }),
        invertDark,
      )}
    >
      <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>
        Contrast panel
      </h2>
      <p style={{ margin: 0 }}>
        I read the dark flag from my ancestors. I do not
        choose a theme.
      </p>
      {children}
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useState<
    "system" | "light" | "dark"
  >("system");

  return (
    <div
      style={
        {
          system: mergeStyles(
            disable("%dark"),
            on(
              "@media (prefers-color-scheme: dark)",
              enable("%dark"),
            ),
          ),
          light: disable("%dark"),
          dark: enable("%dark"),
        }[theme]
      }
    >
      <main
        style={mergeStyles(
          {
            background: "#f8fafc",
            color: "#0f172a",
            colorScheme: "light",
            padding: 32,
            minHeight: "100vh",
            boxSizing: "border-box",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.5,
          },
          on("%dark", {
            background: "#0f172a",
            color: "#f8fafc",
            colorScheme: "dark",
          }),
          invertDark,
        )}
      >
        <label>
          Page theme:{" "}
          <select
            value={theme}
            onChange={event =>
              setTheme(
                event.currentTarget.value as
                  "system" | "light" | "dark",
              )
            }
            style={mergeStyles(
              {
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "#cbd5e1",
                borderRadius: 8,
                padding: "8px 10px",
                background: "#fff",
                color: "#0f172a",
                font: "inherit",
              },
              on("%dark", {
                borderColor: "#475569",
                background: "#1e293b",
                color: "#f8fafc",
              }),
            )}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <h1 style={{ fontSize: 24 }}>Page theme</h1>
        <ContrastPanel>
          <div style={{ marginTop: 16 }}>
            <ContrastPanel />
          </div>
        </ContrastPanel>
      </main>
    </div>
  );
}
```

```typescript sandpack
// css.ts

import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";

export const { styleSheet, on, enable, disable } =
  createHooks(
    "@media (prefers-color-scheme: dark)",
    "%dark",
  );
```

```tsx sandpack
// main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { styleSheet } from "./css";

document.body.style.margin = "0";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <style
      dangerouslySetInnerHTML={{ __html: styleSheet() }}
    />
    <App />
  </StrictMode>,
);
```

## Theme inheritance

The `"%dark"` hook carries the theme as inherited boolean
state. `enable("%dark")` and `disable("%dark")` set that
state for an element's descendants, and `on("%dark", …)`
applies style overrides when the flag is enabled.

Notice that the `ContrastPanel` component doesn't expose a
`theme` prop or consume React Context. These aren't needed
because the page defines an initial state, and its
descendants receive it through efficient CSS mechanisms. The
initial state comes from either a media query or explicit
user selection and is then passed down through a
[flag](../../configuration/#flags).

## Inversion boundary

```typescript
const invertDark = mergeStyles(
  enable("%dark"),
  on("%dark", disable("%dark")),
);
```

An inversion boundary element switches dark mode on or off
at each nesting level. When the boundary inherits an enabled
dark-mode flag, it disables the flag for its descendants.
Otherwise, it enables the flag for them.

Passing `invertDark` to `mergeStyles` adds the boundary to a
style. The `App` component applies it once on the `<main>`
element for an initial inversion; then, each `ContrastPanel`
applies it again to invert its own children.
