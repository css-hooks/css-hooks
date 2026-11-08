import { on } from "./css";

export function App() {
  return <button style={on("&:hover", { color: "red" })}>Hover me</button>;
}
