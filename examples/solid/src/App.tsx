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
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center",
      })}
    >
      <div style={{ "font-size": "192px" }}>
        <Logo />
      </div>
      <a
        href="https://css-hooks.com/docs/solid/getting-started"
        style={hooks({
          "font-family": "Inter, sans-serif",
          "font-size": "1.333rem",
          "font-weight": 700,
          "letter-spacing": "-0.03em",
          border: 0,
          "text-decoration": "none",
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
