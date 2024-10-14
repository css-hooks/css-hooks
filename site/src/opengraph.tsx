import type { ReactNode } from "react";
import * as V from "varsace";

import { Logo } from "./components.js";

export function Opengraph() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100dvw",
        height: "100dvh",
        background: V.gray85,
      }}
    >
      <Banner>
        <div style={{ display: "flex", gap: "0.2em" }}>
          Do the
          <span
            style={{
              color: V.pink30,
            }}
          >
            impossible
          </span>
          with
        </div>
      </Banner>
      <div
        style={{
          width: "100%",
          flex: 1,
          background: V.gray90,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Logo size="8rem" />
      </div>
      <Banner>
        <div>native inline styles.</div>
      </Banner>
    </div>
  );
}

function Banner({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        padding: "1em",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        lineHeight: 1,
        fontSize: "2.5rem",
        letterSpacing: "-0.03em",
        color: V.gray50,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
}
