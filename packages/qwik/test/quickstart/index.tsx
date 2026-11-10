import { component$ } from "@qwik.dev/core";

import { on } from "../css";

export default component$(() => (
  <button style={on("&:hover", { color: "red" })}>Hover me</button>
));
