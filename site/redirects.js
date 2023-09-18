const fs = require("fs/promises");
const path = require("path");

const redirects = {
  "/docs": "/docs/react/getting-started",
  "/docs/react": "/docs/react/getting-started",
  "/docs/solid": "/docs/solid/getting-started",
  "/docs/preact": "/docs/preact/getting-started",
};

Promise.all(
  Object.entries(redirects).map(async ([from, to]) => {
    const dest = path.resolve(
      __dirname,
      "out",
      ...from.split("/").slice(1),
      "index.html",
    );
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(
      dest,
      `<!DOCTYPE html><html><head><meta http-equiv="refresh"
   content="0; url=${to}"></head></html>`,
    );
  }),
)
  .then(() => {
    console.log("Successfully created redirects.");
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
