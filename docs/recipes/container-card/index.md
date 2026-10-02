---
title: Responsive card
description:
  Adapt a reusable card to its container with a container
  query
order: 2
hidden: true
---

# Responsive card

Media queries are a great way to implement viewport-relative
responsive behavior on a website. But in a web application
context, it is usually better for a reusable component to
respond to its surrounding context. For example, a card in a
sidebar has less room than the same card in the main content
area, even on a wide screen. Query its container instead of
the viewport so the component adapts to the space it
actually receives.

The card component demonstrated here implements this
responsive design approach. Try adjusting the slider to
change the width of the container. Notice that the content
layout changes when you cross the 400px threshold.

```tsx sandpack
// App.tsx

import { useState } from "react";

import { mergeStyles, on } from "./css";

const image =
  "https://images.unsplash.com/" +
  "photo-1501785888041-af3ef285b470?" +
  "auto=format&fit=crop&w=960&q=80";

function Card() {
  return (
    <article
      style={mergeStyles(
        {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          background: "#fff",
          color: "#0f172a",
          boxShadow: "0 1px 3px rgb(15 23 42 / 0.08)",
        },
        on("@container (min-width: 400px)", {
          flexDirection: "row",
        }),
      )}
    >
      <img
        src={image}
        alt="Mountain landscape"
        width={960}
        height={640}
        style={mergeStyles(
          {
            display: "block",
            width: "100%",
            height: 176,
            objectFit: "cover",
            flexShrink: 0,
          },
          on("@container (min-width: 400px)", {
            width: 180,
            height: "auto",
          }),
        )}
      />
      <div
        style={mergeStyles(
          { minWidth: 0, padding: 20 },
          on("@container (min-width: 400px)", {
            padding: 24,
          }),
        )}
      >
        <p
          style={{
            margin: "0 0 8px",
            color: "#2563eb",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Travel
        </p>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 20,
            lineHeight: 1.25,
          }}
        >
          A weekend above the clouds
        </h2>
        <p
          style={{
            margin: "0 0 20px",
            color: "#475569",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          Quiet trails, alpine lakes, and everything you
          need for two days away.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "grid",
              placeItems: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#e2e8f0",
              color: "#334155",
              fontWeight: 700,
            }}
          >
            AM
          </span>
          <span>
            <strong style={{ display: "block" }}>
              Alex Morgan
            </strong>
            <span style={{ color: "#64748b" }}>
              6 min read
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [width, setWidth] = useState(320);

  return (
    <main
      style={mergeStyles(
        {
          padding: 24,
          overflowX: "auto",
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          boxSizing: "border-box",
        },
        on("@media (prefers-color-scheme: dark)", {
          background: "#0f172a",
          color: "#f8fafc",
        }),
      )}
    >
      <label
        style={{
          display: "grid",
          gap: 8,
          width: 480,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span>Container width</span>
          <output>{width}px</output>
        </span>
        <input
          type="range"
          max={480}
          step={1}
          value={width}
          style={mergeStyles(
            {
              width: 480,
              margin: 0,
              accentColor: "#0f172a",
            },
            on("@media (prefers-color-scheme: dark)", {
              accentColor: "#e2e8f0",
            }),
          )}
          onChange={event =>
            setWidth(
              Math.max(
                event.currentTarget.valueAsNumber,
                240,
              ),
            )
          }
        />
      </label>
      <section
        style={{
          width,
          containerType: "inline-size",
        }}
      >
        <Card />
      </section>
    </main>
  );
}
```

```typescript sandpack
// css.ts

import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";
export const { styleSheet, on } = createHooks(
  "@container (min-width: 400px)",
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

## Query container

`containerType: "inline-size"` turns the wrapper into a size
query container on its inline axis (width). Its descendants
can now test the available width, while its height remains
driven by its content. That is all this horizontal
breakpoint needs.

The condition is unnamed, so the browser uses the nearest
ancestor eligible for inline-size queries. This keeps the
hook generic: The card can move between a sidebar, grid
track, or dialog and respond to whichever local container
provides its space.

> [!NOTE] The slider is only a control for the demo. It
> updates the wrapper's width, then the browser reevaluates
> the container query. React never decides whether the card
> should use its stacked or horizontal layout.

## Container-relative styles

The base styles stack the image and content. At widths of
400px and above, `on("@container (min-width: 400px)", ...)`
changes the article's flex direction, gives the image a
fixed width, and increases the content padding. Each
override only replaces the properties it declares; the rest
of the base card remains unchanged.

A container query measures an ancestor, not the element it
styles. Keep the query-container wrapper outside the card;
putting `containerType` on the card itself would not let it
query its own width.

> [!NOTE] If the layout must instead follow a container
> farther up the tree, an element inside that container can
> use its own query to enable an inherited
> [flag](../../configuration/#flags) for the component
> subtree.
