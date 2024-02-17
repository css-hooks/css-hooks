import { Slot, component$ } from "@builder.io/qwik";
import { css } from "~/css";

export const Block = component$(() => (
  <div
    style={css({
      width: "calc(100vw - 4rem)",
      maxWidth: "80rem",
      margin: "0 auto",
    })}
  >
    <Slot />
  </div>
));
