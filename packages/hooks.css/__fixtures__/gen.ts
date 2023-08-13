import fs from "fs/promises";
import { transform } from "lightningcss";
import path from "path";
import selectors from "@hooks.css/core/selectors";

const css = `
.hooks {
  ${Object.keys(selectors as Record<string, unknown>)
    .flatMap((hookType) => [`--${hookType}-0: initial;`, `--${hookType}-1: ;`])
    .join("\n  ")}
}

${Object.entries(selectors as Record<string, unknown>)
  .map(
    ([hookType, selector]) => `.hooks${
      typeof selector === "string" ? selector : ""
    } {
  --${hookType}-0: ;
  --${hookType}-1: initial;
}`
  )
  .join("\n\n")}
`;

const { code: minCSS, map } = transform({
  filename: "index.css",
  code: Buffer.from(css),
  minify: true,
  sourceMap: true,
});

async function writeOutput(
  to: string,
  contents: Parameters<typeof fs.writeFile>[1]
) {
  await fs.mkdir(path.dirname(path.resolve(to)), { recursive: true });
  await fs.writeFile(path.resolve(to), contents);
}

(async function main() {
  await writeOutput("index.css", css);
  await writeOutput("index.min.css", minCSS);
  if (map) {
    await writeOutput("index.min.css.map", map);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
