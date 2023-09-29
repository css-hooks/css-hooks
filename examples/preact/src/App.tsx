import Logo from "./Logo";
import hooks from "./css-hooks";

function App() {
  return (
    <div
      style={hooks({
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: "var(--white)",
        color: "var(--black)",
        dark: { background: "var(--black)", color: "var(--white)" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <div style={{ fontSize: 192 }}>
        <Logo />
      </div>
      <a
        href="https://css-hooks.com/docs/preact/getting-started"
        style={hooks({
          fontFamily: "Inter, sans-serif",
          fontSize: "1.333rem",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          border: 0,
          textDecoration: "none",
          background: "var(--gray-800)",
          color: "var(--white)",
          padding: "0.5em 0.75em",
          display: "inline-block",
          hover: {
            background: "var(--blue-700)",
          },
          active: {
            background: "var(--red-700)",
          },
        })}
      >
        Get started
      </a>
    </div>
  );
}

export default App;
