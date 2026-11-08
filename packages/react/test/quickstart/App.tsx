import { on } from "./css";

export default function App() {
  return <button style={on("&:hover", { color: "red" })}>Hover me</button>;
}
