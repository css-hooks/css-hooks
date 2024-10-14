import * as V from "varsace";

import { Emblem } from "./components.js";

export function Icon() {
  return (
    <>
      <div
        style={{
          background: V.gray85,
          width: "100dvw",
          height: "100dvh",
          borderRadius: 9999,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100dvw",
          height: "100dvh",
          display: "grid",
          placeItems: "center",
          fontSize: "80dvmax",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            position: "relative",
            top: "-5dvh",
            left: "2.5dvw",
          }}
        >
          <Emblem />
        </div>
      </div>
    </>
  );
}
