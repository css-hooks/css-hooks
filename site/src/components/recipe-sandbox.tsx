import type { SandpackTheme } from "@codesandbox/sandpack-react";
import { getSandpackCssText, Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";
import { mergeDeep, pick } from "remeda";

import { devDependencies } from "../../package.json";
import { themeAttr } from "../data/themes.ts";
import { blue, gray, pink, purple, white, yellow } from "../design/colors.ts";
import { monospace, sansSerif } from "../design/typography.ts";

const withTypography = mergeDeep({
  syntax: { comment: { fontStyle: "italic" } },
  font: { body: sansSerif, mono: monospace, size: "14px", lineHeight: "1.5" },
} satisfies Pick<SandpackTheme, "font"> & {
  syntax: Pick<SandpackTheme["syntax"], "comment">;
});

// Match Shiki's palette using Sandpack's coarser token categories.
const lightTheme = withTypography({
  colors: {
    surface1: "#ffffff",
    surface2: gray(10),
    surface3: gray(20),
    disabled: gray(60),
    base: gray(80),
    clickable: gray(60),
    hover: gray(90),
    accent: purple(65),
  },
  syntax: {
    plain: gray(75),
    comment: { color: gray(55) },
    keyword: pink(60),
    definition: blue(55),
    punctuation: gray(60),
    property: blue(65),
    tag: pink(60),
    static: yellow(65),
    string: purple(65),
  },
}) satisfies SandpackTheme;

const darkTheme = withTypography({
  colors: {
    surface1: gray(85),
    surface2: gray(80),
    surface3: gray(70),
    disabled: gray(45),
    base: gray(15),
    clickable: gray(35),
    hover: white,
    accent: purple(30),
  },
  syntax: {
    plain: gray(20),
    comment: { color: gray(40) },
    keyword: pink(35),
    definition: blue(25),
    punctuation: gray(45),
    property: blue(30),
    tag: pink(35),
    static: yellow(35),
    string: purple(30),
  },
}) satisfies SandpackTheme;

function SandpackStyles() {
  // Keep the SSR stylesheet mounted and unchanged: Sandpack updates it via CSSOM.
  const [css] = useState(
    () =>
      `${getSandpackCssText()}.sp-wrapper [title="Open in CodeSandbox"]{display:none}`,
  );
  return (
    <style
      dangerouslySetInnerHTML={{ __html: css }}
      href="sandpack"
      precedence="default"
      suppressHydrationWarning
    />
  );
}

export default function RecipeSandbox({
  files,
}: {
  files: Record<string, string>;
}) {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const root = document.documentElement;
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const choice = root.getAttribute(themeAttr);
      setTheme(
        choice === "dark" || (choice === "auto" && preference.matches)
          ? darkTheme
          : lightTheme,
      );
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: [themeAttr] });
    preference.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", sync);
    };
  }, []);

  return (
    <>
      <Sandpack
        template="react-ts"
        theme={theme}
        files={files}
        customSetup={{
          entry: "/main.tsx",
          dependencies: pick(devDependencies, ["@css-hooks/react", "remeda"]),
        }}
        options={{
          visibleFiles: Object.keys(files),
          activeFile: "/App.tsx",
          showTabs: true,
          editorHeight: 560,
          showLineNumbers: true,
          showInlineErrors: true,
          showRefreshButton: true,
          resizablePanels: true,
        }}
      />
      <SandpackStyles />
    </>
  );
}
