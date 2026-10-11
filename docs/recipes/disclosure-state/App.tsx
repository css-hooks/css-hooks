import { mergeStyles, on } from "./css";

function Question({
  question,
  children,
}: {
  question: string;
  children: string;
}) {
  return (
    <details
      style={mergeStyles(
        {
          overflow: "hidden",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#e2e8f0",
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 1px 2px rgb(15 23 42 / 0.05)",
        },
        on("%dark", {
          borderColor: "#334155",
          background: "#1e293b",
          boxShadow: "0 1px 2px rgb(0 0 0 / 0.2)",
        }),
        on("&:open", {
          borderColor: "#6d28d9",
          boxShadow: "0 8px 24px rgb(15 23 42 / 0.1)",
        }),
      )}
    >
      <summary
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          padding: 20,
          fontWeight: 700,
          cursor: "pointer",
          outline: "none",
        }}
      >
        {question}
        <span
          aria-hidden="true"
          style={mergeStyles(
            {
              display: "grid",
              boxSizing: "border-box",
              flex: "0 0 auto",
              placeItems: "center",
              width: 32,
              height: 32,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#c4b5fd",
              borderRadius: "50%",
              background: "#ede9fe",
              color: "#5b21b6",
              outlineWidth: 3,
              outlineStyle: "solid",
              outlineColor: "transparent",
              outlineOffset: 0,
              transform: "rotate(0deg)",
              transition: "transform 150ms",
            },
            on("%dark", {
              background: "#334155",
              color: "#c4b5fd",
            }),
            on(":focus-visible &", {
              outlineColor: "#2563eb",
            }),
            on(":open &", {
              transform: "rotate(90deg)",
            }),
          )}
        >
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              d="m6 3 5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>
      <div
        style={mergeStyles(
          {
            padding: "0 20px 20px",
            color: "#475569",
            lineHeight: 1.6,
          },
          on(":open &", { color: "#334155" }),
          on("%dark", { color: "#cbd5e1" }),
        )}
      >
        {children}
      </div>
    </details>
  );
}

export default function App() {
  return (
    <main
      style={mergeStyles(
        {
          boxSizing: "border-box",
          minHeight: 520,
          padding: 32,
          background: "#f8fafc",
          color: "#0f172a",
          colorScheme: "light",
          fontFamily: "system-ui, sans-serif",
        },
        on("%dark", {
          background: "#0f172a",
          color: "#f8fafc",
          colorScheme: "dark",
        }),
      )}
    >
      <section
        style={{
          width: "min(100%, 640px)",
          margin: "32px auto",
        }}
      >
        <p
          style={mergeStyles(
            {
              margin: "0 0 8px",
              color: "#6d28d9",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            },
            on("%dark", { color: "#c4b5fd" }),
          )}
        >
          Help center
        </p>
        <h1
          style={{
            margin: "0 0 24px",
            fontSize: 32,
          }}
        >
          Frequently asked questions
        </h1>
        <div style={{ display: "grid", gap: 10 }}>
          <Question question="Can I change my plan later?">
            Yes. Upgrade or downgrade at any time; the
            change is prorated automatically.
          </Question>
          <Question question="Do you offer a free trial?">
            Every plan includes a 14-day trial. No payment
            details are required to start.
          </Question>
          <Question question="How do I cancel?">
            Cancel from account settings. Your workspace
            remains available through the end of the billing
            period.
          </Question>
        </div>
      </section>
    </main>
  );
}
