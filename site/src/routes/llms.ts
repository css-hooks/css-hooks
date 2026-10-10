import { createLlmsIndex } from "../data/llms.ts";

export function loader() {
  return new Response(createLlmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
