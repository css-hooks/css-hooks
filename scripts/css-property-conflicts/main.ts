import { parseArgs } from "node:util";

import {
  buildCSSPropertyConflictData,
  renderCSSPropertyConflicts,
} from "./generate.ts";

async function main() {
  const { values } = parseArgs({
    options: {
      casing: {
        type: "string",
        multiple: true,
      },
    },
  });
  const casings = new Set(
    (values.casing ?? []).map(casing => {
      if (casing !== "camel" && casing !== "kebab") {
        throw new Error(`Invalid CSS property casing: ${casing}`);
      }
      return casing;
    }),
  );
  if (casings.size === 0) {
    throw new Error('Missing required option: "--casing <camel|kebab>"');
  }
  const output = await renderCSSPropertyConflicts(
    buildCSSPropertyConflictData(),
    casings,
  );
  process.stdout.write(output);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
