---
title: Button interaction states
description:
  Combine hover, keyboard focus, active, and disabled states
  with accessible defaults
order: 1
hidden: true
---

# Button interaction states

A `<button>` element should respond to a pointer, remain
easy to find with a keyboard, and clearly communicate when
it is disabled. Selector hooks handle those states through
efficient CSS mechanisms instead of pointer or keyboard
event handlers.

Try testing the following states:

- Hover and press it to see the pointer states.
- Focus it via keyboard navigation to see the focus ring.
- Toggle the checkbox to see the disabled state.
- Enable reduced motion in your system settings to remove
  transitions.

```tsx sandpack
// App.tsx

import type { ComponentProps } from "react";
import { useState } from "react";

import { and, mergeStyles, on } from "./css";

function Button({
  style,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      style={mergeStyles(
        {
          border: 0,
          borderRadius: 8,
          padding: "12px 20px",
          background: "#6d28d9",
          color: "#fff",
          font: "inherit",
          fontWeight: 600,
          cursor: "pointer",
          outlineStyle: "solid",
          outlineWidth: 3,
          outlineColor: "transparent",
          outlineOffset: 3,
        },
        on(
          "@media (prefers-reduced-motion: no-preference)",
          {
            transition: "background 150ms, transform 75ms",
          },
        ),
        on(and("@media (hover: hover)", "&:hover"), {
          background: "#5b21b6",
        }),
        on("&:focus-visible", {
          outlineColor: "#2563eb",
        }),
        on("&:active", {
          background: "#4c1d95",
          transform: "translateY(1px)",
        }),
        on("&:disabled", {
          background: "#e5e7eb",
          color: "#4b5563",
          cursor: "not-allowed",
          transform: "none",
        }),
        on(
          and(
            "@media (prefers-color-scheme: dark)",
            "&:disabled",
          ),
          {
            background: "#334155",
            color: "#94a3b8",
          },
        ),
        style,
      )}
    />
  );
}

export default function App() {
  const [disabled, setDisabled] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <main
      style={mergeStyles(
        {
          padding: 32,
          background: "#f8fafc",
          color: "#0f172a",
          colorScheme: "light",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          boxSizing: "border-box",
        },
        on("@media (prefers-color-scheme: dark)", {
          background: "#0f172a",
          color: "#f8fafc",
          colorScheme: "dark",
        }),
      )}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <input
          type="checkbox"
          checked={disabled}
          style={{ accentColor: "#6d28d9" }}
          onChange={event =>
            setDisabled(event.target.checked)
          }
        />
        Disable button
      </label>
      <Button
        disabled={disabled}
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </Button>
    </main>
  );
}
```

```typescript sandpack
// css.ts

import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";

export const { styleSheet, on, and } = createHooks(
  "&:hover",
  "&:focus-visible",
  "&:active",
  "&:disabled",
  "@media (hover: hover)",
  "@media (prefers-reduced-motion: no-preference)",
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

## Hook composition

The `and` function combines two hooks to form a complex
condition: The expression
`and("@media (hover: hover)", "&:hover")` applies the hover
color only on devices that can actually hover, such as those
with a mouse or trackpad.

On a touchscreen or a TV remote, `&:hover` is either
unavailable or activates on taps (and then sticks), so the
media query keeps the hover styling off those devices.
(`&:focus-visible`, unlike `&:hover`, stands alone, so
keyboard users get a visible focus ring regardless of
pointer capabilities.)

## Override precedence

For a given property, the last matching ruleset wins.
`&:active` follows the hover ruleset, so pressing the
hovered `<button>` element uses the `&:active` background.
`&:disabled` comes last, replacing the background and
resetting the transform — so a disabled `<button>` element
that also matches `&:hover` still shows the disabled
styling, and the hover rule needs no enabled condition.

An override only affects the properties it declares. The
focus outline is a separate property, so `&:active` styling
does not remove it.

## Native state handling

Pseudo-classes such as `&:hover` and `&:focus-visible` use
the browser's own interaction state. That behavior is
consistent across virtually every web application, so users
already hold strong, deeply ingrained expectations for it:
Keyboard users trust the focus ring, and pointer users
expect the hover response. Matching the browser meets those
expectations without any interaction code.

Emulating the same states with `onMouseEnter`,
`onMouseLeave`, `onFocus`, and `onBlur` would take more code
and still be subtly wrong. The handlers run in JavaScript,
so they can miss keyboard and assistive-technology paths,
and in React they would hold a low-level interaction state
in component state. Because that state changes on nearly
every pointer movement, keeping it in React causes a large
volume of unnecessary re-renders. Leaving the states to CSS
lets React render only when application data changes.

## Style escape hatch

`Button` accepts a `style` prop and passes it last to
`mergeStyles`. `mergeStyles` moves each overridden property
to the end of the style object, so later declarations take
precedence and the consumer's values replace the component's
internal values for those properties, including values set
by hooks. Treat `style` as a predictable escape hatch for
layout or one-off customization; it also lets callers
override declarations outside the component's documented
API, so expose it only when that flexibility is warranted.
