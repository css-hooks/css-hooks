import { minify as minifyImpl } from "csso";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const minify = x =>
  process.env.NODE_ENV === "production" && x ? minifyImpl(x.toString()).css : x;

export async function resolve(specifier, _, nextResolve) {
  if (!specifier.endsWith(".css")) {
    return nextResolve(specifier);
  }
  const { url } = await nextResolve(specifier);
  return {
    format: "css",
    shortCircuit: true,
    url,
  };
}

export async function load(url, context, nextLoad) {
  if (context.format !== "css") {
    return nextLoad(url);
  }
  const data = minify(await fs.readFile(fileURLToPath(url)), "utf8");
  return {
    format: "module",
    shortCircuit: true,
    source: `export default \`${data}\``,
  };
}
