import { createLlmsFull } from "../data/llms.ts";

export function loader() {
  return new Response(createLlmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
