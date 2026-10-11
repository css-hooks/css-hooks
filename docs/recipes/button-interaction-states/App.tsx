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
        on(and("%dark", "&:disabled"), {
          background: "#334155",
          color: "#94a3b8",
        }),
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
          minHeight: 520,
          boxSizing: "border-box",
        },
        on("%dark", {
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
