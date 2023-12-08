"use client";

import { U } from "ts-toolbelt";
import * as prettier from "prettier/standalone";
import * as prettierEstree from "prettier/plugins/estree";
import * as prettierTypescript from "prettier/plugins/typescript";
import { useEffect, useMemo, useState } from "react";
import Code from "@/components/Code";
import Pre from "@/components/Pre";
import type frameworks from "../frameworks";

const baseStyles = {
  border: 0,
  margin: 0,
  padding: "0.75rem 1rem",
  fontFamily: "sans-serif",
  fontSize: "1rem",
  background: "#333",
  color: "#fff",
  borderRadius: "0.5rem",
};

const examples = {
  initial: example(baseStyles, true),
  cssWrap: example(baseStyles),
  hoverHook: example({ ...baseStyles, ":hover": { background: "#444" } }),
  hookOrder: example({
    ...baseStyles,
    ":hover": { background: "#444" },
    ":disabled": { background: "#333", color: "#666", cursor: "not-allowed" },
  }),
  composition: example({
    ...baseStyles,
    ":enabled": {
      ":hover": {
        background: "#444",
      },
    },
  }),
};

export default function CodeExample({
  name,
  framework,
}: {
  name: keyof typeof examples;
  framework: (typeof frameworks)[number];
}) {
  const code = useMemo(() => examples[name](framework), [name, framework]);
  const [formatted, setFormatted] = useState("");
  useEffect(() => {
    let canceler = false;

    prettier
      .format(code, {
        plugins: [prettierEstree, prettierTypescript],
        parser: "typescript",
      })
      .then(formatted => {
        if (!canceler) {
          setFormatted(formatted);
        }
      })
      .catch(() => {});

    return () => {
      canceler = true;
    };
  }, [code]);

  return (
    <Pre>
      <Code className="language-typescript">{formatted}</Code>
    </Pre>
  );
}

function example(style: Record<string, unknown>, noHooks = false) {
  return (framework: (typeof frameworks)[number]) => `
    // src/Button.tsx${noHooks ? "" : '\n\nimport { css } from "./css-hooks";'}

    export default function Button(props: Props) {
      return (
        <button
          {...props}
          style={${noHooks ? "" : "css("}${JSON.stringify(
            framework === "solid" ? keybab(style) : style,
          )
            .replace(/"([A-Za-z]+)":/g, (_, x) => `${x}:`)
            .replace("}", "      }")}${noHooks ? "" : ")"}}
        />
      );
    }
  `;
}

type CamelToKebab<
  S extends string,
  Acc extends string = "",
> = S extends `${infer H}${infer T}`
  ? CamelToKebab<T, `${Acc}${H extends Capitalize<H> ? `-${Lowercase<H>}` : H}`>
  : Acc;

function keybab<R extends Record<string, unknown>, K extends keyof R = keyof R>(
  r: R,
): U.IntersectOf<K extends string ? Record<CamelToKebab<K>, R[K]> : never> {
  return Object.fromEntries(
    Object.entries(r).map(([key, value]) => [
      key.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`),
      value,
    ]),
  ) as any;
}
