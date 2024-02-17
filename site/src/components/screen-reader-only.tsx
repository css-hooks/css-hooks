import { Slot, component$, type CSSProperties } from "@builder.io/qwik";
import { css } from "~/css";

type Props = {
  style?: CSSProperties;
};

export const ScreenReaderOnly = component$(({ style }: Props) => (
  <div
    style={css(
      {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        border: 0,
      },
      style,
    )}
  >
    <Slot />
  </div>
));
