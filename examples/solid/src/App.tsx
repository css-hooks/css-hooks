import {
  black,
  blue40,
  blue50,
  gray50,
  gray70,
  red40,
  red50,
  white,
} from "varsace";
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
        background: white,
        color: black,
        dark: { background: black, color: white },
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
          background: gray50,
          color: white,
          padding: "0.5em 0.75em",
          display: "inline-block",
          hover: {
            background: blue40,
          },
          active: {
            background: red40,
          },
          dark: {
            background: gray70,
            hover: {
              background: blue50,
            },
            active: {
              background: red50,
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
