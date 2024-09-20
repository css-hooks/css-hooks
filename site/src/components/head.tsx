import type { JSXChildren } from "hastx/jsx-runtime";

import { styleSheet } from "../css.js";
import { ThemeSwitcherScript } from "./theme-switcher.js";

export function Head({ children }: { children?: JSXChildren }) {
  return (
    <head>
      <meta charset="utf-8" />
      <ThemeSwitcherScript />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Assistant:wght@200..800&family=Inconsolata:wght@200..900&family=Inter:wght@100..900&display=swap"
        rel="stylesheet"
      />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/2.0.0/modern-normalize.min.css"
        rel="stylesheet"
      />
      <style>{styleSheet()}</style>
      <>{children}</>
    </head>
  );
}
