import * as V from "varsace";
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
        background: V.white,
        color: V.black,
        dark: { background: V.black, color: V.white },
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
        href="https://css-hooks.com/docs/preact/getting-started"
        style={hooks({
          "font-family": "Inter, sans-serif",
          "font-size": "1.333rem",
          "font-weight": 700,
          "letter-spacing": "-0.03em",
          border: 0,
          "text-decoration": "none",
          background: V.gray50,
          color: V.white,
          padding: "0.5em 0.75em",
          display: "inline-block",
          hover: {
            background: V.blue40,
          },
          active: {
            background: V.red40,
          },
          dark: {
            background: V.gray70,
            hover: {
              background: V.blue50,
            },
            active: {
              background: V.red50,
            },
          },
        })}
      >
        Get started
      </a>
    </div>
  );
}

export default App;
