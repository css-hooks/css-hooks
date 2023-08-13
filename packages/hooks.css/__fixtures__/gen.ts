import fs from "fs/promises";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import path from "path";
import selectors from "@hooks.css/core/selectors";
import postcss from "postcss";

const rawCSS = `
.hooks {
  ${Object.keys(selectors as Record<string, unknown>)
    .flatMap(hookType => [`--${hookType}-0: initial;`, `--${hookType}-1: ;`])
    .join("\n  ")}
}

${Object.entries(selectors as Record<string, (selectorBase: string) => string>)
  .map(
    ([hookType, selector]) => `${selector(".hooks")} {
  --${hookType}-0: ;
  --${hookType}-1: initial;
}`,
  )
  .join("\n\n")}
`;

async function writeOutput(
  to: string,
  contents: Parameters<typeof fs.writeFile>[1],
) {
  await fs.mkdir(path.dirname(path.resolve(to)), { recursive: true });
  await fs.writeFile(path.resolve(to), contents);
}

(async function main() {
  const original = await postcss([autoprefixer]).process(rawCSS, {
    from: undefined,
    to: "index.css",
    map: { inline: false },
  });

  await writeOutput("index.css", original.css);
  original.map && (await writeOutput("index.css.map", original.map.toString()));

  const minified = await postcss([autoprefixer, cssnano]).process(rawCSS, {
    from: undefined,
    to: "index.min.css",
    map: { inline: false },
  });

  await writeOutput("index.min.css", minified.css);
  minified.map &&
    (await writeOutput("index.min.css.map", minified.map.toString()));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
