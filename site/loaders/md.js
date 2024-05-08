import fs from "fs/promises";
import { fileURLToPath } from "url";
import matter from "gray-matter";

export async function resolve(specifier, _, nextResolve) {
  if (!specifier.endsWith(".md")) {
    return nextResolve(specifier);
  }
  const { url } = await nextResolve(specifier);
  return {
    format: "md",
    shortCircuit: true,
    url,
  };
}

export async function load(url, context, nextLoad) {
  if (context.format !== "md") {
    return nextLoad(url);
  }
  const data = JSON.stringify(
    matter(await fs.readFile(fileURLToPath(url), "utf8")),
  );
  return {
    format: "module",
    shortCircuit: true,
    source: `export default ${data}`,
  };
}
