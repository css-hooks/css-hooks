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
          on("%dark", {
            borderColor: "#475569",
            background: "#1e293b",
            color: "#f8fafc",
          }),
          on("&:focus", {
            borderColor: "#2563eb",
          }),
          on(and("%dark", "&:focus"), {
            borderColor: "#60a5fa",
          }),
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
              "top 150ms, color 150ms, " +
              "font-size 150ms, transform 150ms",
          },
          on(placeholder, {
            top: "50%",
            background: "transparent",
            color: "#64748b",
            fontSize: 16,
            transform: "translateY(-50%)",
          }),
          on("%dark", {
            background: "#1e293b",
            color: "#c4b5fd",
          }),
          on(and("%dark", placeholder), {
            background: "transparent",
            color: "#94a3b8",
          }),
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
          on("%dark", {
            borderColor: "#334155",
            background: "#1e293b",
            boxShadow: "0 12px 32px rgb(0 0 0 / 0.25)",
          }),
        )}
      >
        <div>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: 24,
            }}
          >
            Join the newsletter
          </h1>
          <p
            style={mergeStyles(
              { margin: 0, color: "#475569" },
              on("%dark", { color: "#cbd5e1" }),
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
