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
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#e2e8f0",
          borderRadius: 12,
          background: "#fff",
          color: "#0f172a",
          boxShadow: "0 1px 3px rgb(15 23 42 / 0.08)",
        },
        on("@container (min-width: 400px)", {
          flexDirection: "row",
        }),
        on("%dark", {
          borderColor: "#334155",
          background: "#1e293b",
          color: "#f8fafc",
          boxShadow: "0 1px 3px rgb(0 0 0 / 0.2)",
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
          style={mergeStyles(
            {
              margin: "0 0 8px",
              color: "#6d28d9",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            },
            on("%dark", { color: "#c4b5fd" }),
          )}
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
          style={mergeStyles(
            {
              margin: "0 0 20px",
              color: "#475569",
              fontSize: 14,
              lineHeight: 1.5,
            },
            on("%dark", { color: "#cbd5e1" }),
          )}
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
            style={mergeStyles(
              {
                display: "grid",
                placeItems: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#f1f5f9",
                color: "#334155",
                fontWeight: 700,
              },
              on("%dark", {
                background: "#334155",
                color: "#f8fafc",
              }),
            )}
          >
            AM
          </span>
          <span>
            <strong style={{ display: "block" }}>
              Alex Morgan
            </strong>
            <span
              style={mergeStyles(
                { color: "#64748b" },
                on("%dark", { color: "#94a3b8" }),
              )}
            >
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
          padding: 32,
          overflowX: "auto",
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
          style={{
            width: 480,
            margin: 0,
            accentColor: "#6d28d9",
          }}
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
