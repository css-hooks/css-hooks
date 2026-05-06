const stack = (fonts: string[], genericFallback: string) =>
  [...fonts]
    .reverse()
    .reduce((stack, font) => `"${font}",${stack}`, genericFallback);

export const sansSerif = stack(
  [
    /* Modern systems */
    "Inter",

    /* macOS/iOS */
    "-apple-system",
    "BlinkMacSystemFont",

    /* Windows */
    "Segoe UI",

    /* Android/ChromeOS */
    "Roboto",

    /* Linux/Generic */
    "Helvetica Neue",
    "Arial",
  ],
  "sans-serif",
);

export const monospace = stack(
  [
    /* Windows */
    "Consolas",

    /* macOS/iOS */
    "Menlo",
    "Monaco",

    /* Android/ChromeOS */
    "Roboto Mono",

    /* Linux */
    "Liberation Mono",

    /* Generic */
    "Lucida Console",
    "Courier New",
  ],
  "monospace",
);
