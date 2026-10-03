---
title: Custom placeholder
description:
  Display an accessible physical label from an input's
  native placeholder state
order: 2
hidden: true
---

# Custom placeholder

Developers often reach for the `::placeholder`
pseudo-element when a physical element can do the same job
with the help of the `:placeholder-shown` pseudo-class. A
physical `<label>` element can move, resize, and remain the
input's accessible name instead of acting as temporary hint
text.

Focus a field or enter a value to float its label. Clear the
field and move focus away to return the label to its
placeholder position.

```tsx sandpack
// App.tsx

import { and, mergeStyles, on } from "./css";

const placeholder = and(
  ":placeholder-shown + &",
  ":not(:focus) + &",
);

function Field({ label }: { label: string }) {
  return (
    <label
      style={{
        position: "relative",
        display: "block",
      }}
    >
      <input
        placeholder=" "
        style={mergeStyles(
          {
            boxSizing: "border-box",
            width: "100%",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "#cbd5e1",
            borderRadius: 8,
            padding: "16px 14px",
            background: "#fff",
            color: "#0f172a",
            font: "inherit",
            outline: "none",
            transition: "border-color 150ms",
          },
          on("@media (prefers-color-scheme: dark)", {
            borderColor: "#475569",
            background: "#1e293b",
            color: "#f8fafc",
          }),
          on("&:focus", {
            borderColor: "#2563eb",
          }),
          on(
            and(
              "@media (prefers-color-scheme: dark)",
              "&:focus",
            ),
            { borderColor: "#60a5fa" },
          ),
        )}
      />
      <span
        style={mergeStyles(
          {
            position: "absolute",
            top: 0,
            left: 11,
            padding: "0 5px",
            background: "#fff",
            color: "#6d28d9",
            fontSize: 13,
            lineHeight: 1,
            pointerEvents: "none",
            transform: "translateY(-50%)",
            transformOrigin: "left center",
            transition:
              "top 150ms, color 150ms, font-size 150ms, transform 150ms",
          },
          on(placeholder, {
            top: "50%",
            background: "transparent",
            color: "#64748b",
            fontSize: 16,
            transform: "translateY(-50%)",
          }),
          on("@media (prefers-color-scheme: dark)", {
            background: "#1e293b",
            color: "#c4b5fd",
          }),
          on(
            and(
              "@media (prefers-color-scheme: dark)",
              placeholder,
            ),
            {
              background: "transparent",
              color: "#94a3b8",
            },
          ),
        )}
      >
        {label}
      </span>
    </label>
  );
}

export default function App() {
  return (
    <main
      style={mergeStyles(
        {
          boxSizing: "border-box",
          minHeight: "100vh",
          padding: 32,
          background: "#f8fafc",
          color: "#0f172a",
          colorScheme: "light",
          fontFamily: "system-ui, sans-serif",
        },
        on("@media (prefers-color-scheme: dark)", {
          background: "#0f172a",
          color: "#f8fafc",
          colorScheme: "dark",
        }),
      )}
    >
      <form
        style={mergeStyles(
          {
            boxSizing: "border-box",
            display: "grid",
            gap: 24,
            width: "min(100%, 420px)",
            margin: "40px auto",
            padding: 28,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#e2e8f0",
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 12px 32px rgb(15 23 42 / 0.1)",
          },
          on("@media (prefers-color-scheme: dark)", {
            borderColor: "#334155",
            background: "#1e293b",
            boxShadow: "0 12px 32px rgb(0 0 0 / 0.25)",
          }),
        )}
      >
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 24 }}>
            Join the newsletter
          </h1>
          <p
            style={mergeStyles(
              { margin: 0, color: "#475569" },
              on("@media (prefers-color-scheme: dark)", {
                color: "#cbd5e1",
              }),
            )}
          >
            Occasional updates, no noise.
          </p>
        </div>
        <Field label="Name" />
        <Field label="Email address" />
        <button
          type="submit"
          style={{
            border: 0,
            borderRadius: 8,
            padding: "12px 20px",
            background: "#6d28d9",
            color: "#fff",
            font: "inherit",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Subscribe
        </button>
      </form>
    </main>
  );
}
```

```typescript sandpack
// css.ts

import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";

export const { styleSheet, on, and } = createHooks(
  "&:focus",
  ":placeholder-shown + &",
  ":not(:focus) + &",
  "@media (prefers-color-scheme: dark)",
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

## Placeholder state

The whitespace-only `placeholder=" "` prop gives the browser
a placeholder to track without displaying visible text.
While the field is empty, it matches `:placeholder-shown`.
Once it has a value, it does not.

The `:placeholder-shown + &` and `:not(:focus) + &` hooks
target the `<span>` element containing the label text
through the adjacent-sibling combinator. Combining them with
`and()` keeps the label in its placeholder position only
while the field is empty and unfocused. The `<input>`
element remains responsible for its own focus border.

## Accessible label

Because the `<input>` element and label text are nested
within the same `<label>` element, the visible text is also
the `<input>` element's persistent accessible name. It does
not disappear from assistive technology when the user enters
a value, and clicking the `<label>` element focuses the
field. `pointerEvents: "none"` also ensures the overlaid
text never intercepts a pointer.
