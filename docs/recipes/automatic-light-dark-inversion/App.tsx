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
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: 20,
        }}
      >
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
      style={mergeStyles(
        { display: "contents" },
        theme === "light"
          ? disable("%dark")
          : theme === "dark"
            ? enable("%dark")
            : undefined,
      )}
    >
      <main
        style={mergeStyles(
          {
            background: "#f8fafc",
            color: "#0f172a",
            colorScheme: "light",
            padding: 32,
            minHeight: 520,
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
