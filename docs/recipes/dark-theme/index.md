---
title: Light/dark mode with automatic inversion
description:
  Follow the system theme, support explicit overrides, and
  automatically alternate nested panel themes
order: 3
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
import { pipe } from "remeda";

import { disable, enable, mergeStyles, on } from "./css";

const invertDark = pipe(
  enable("dark"),
  on("flag:dark", disable("dark")),
);

function ContrastPanel({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <section
      style={pipe(
        {
          padding: 20,
          borderRadius: 12,
          border: "1px solid #c4b5fd",
          background: "#fff",
          color: "#3b0764",
        },
        on("flag:dark", {
          borderColor: "#7c3aed",
          background: "#35204f",
          color: "#f3e8ff",
        }),
        mergeStyles(invertDark),
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
          system: pipe(
            disable("dark"),
            on(
              "@media (prefers-color-scheme: dark)",
              enable("dark"),
            ),
          ),
          light: disable("dark"),
          dark: enable("dark"),
        }[theme]
      }
    >
      <main
        style={pipe(
          {
            background: "#faf5ff",
            color: "#3b0764",
            colorScheme: "light",
            padding: 24,
            minHeight: "100vh",
            boxSizing: "border-box",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.5,
          },
          on("flag:dark", {
            background: "#1e102f",
            color: "#f3e8ff",
            colorScheme: "dark",
          }),
          mergeStyles(invertDark),
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
            style={{ font: "inherit" }}
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
    "flag:dark",
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

The `"flag:dark"` hook carries the theme as inherited
boolean state. `enable("dark")` and `disable("dark")` set
that state for an element's descendants, and
`on("flag:dark", …)` applies style overrides when the flag
is enabled.

Notice that the `ContrastPanel` component doesn't expose a
`theme` prop or consume React Context. These aren't needed
because the page defines an initial state, and its
descendants receive it through efficient CSS mechanisms. The
initial state comes from either a media query or explicit
user selection and is then passed down through a
[flag](../../configuration/#flags).

## Inversion boundary

```typescript
const invertDark = pipe(
  enable("dark"),
  on("flag:dark", disable("dark")),
);
```

An inversion boundary element switches dark mode on or off
at each nesting level. When the boundary inherits an enabled
dark-mode flag, it disables the flag for its descendants.
Otherwise, it enables the flag for them.

`mergeStyles(invertDark)` adds the boundary to a style
pipeline. The `App` component applies it once on the `main`
element for an initial inversion; then, each `ContrastPanel`
applies it again to invert its own children.
