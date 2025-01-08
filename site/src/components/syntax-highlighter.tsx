import type { CSSProperties } from "react";
import { use } from "react";
import { codeToHtml } from "shiki";

export function SyntaxHighlighter({
  children: code,
  language,
  style,
}: {
  children: string;
  language: Parameters<typeof codeToHtml>[1]["lang"];
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{
        __html: use(
          codeToHtml(code, {
            lang: language,
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
            transformers: [
              {
                pre(el) {
                  el.tagName = "div";
                  for (const child of el.children) {
                    if (child.type === "element" && child.tagName === "code") {
                      el.children = child.children;
                      break;
                    }
                  }
                },
                line(line) {
                  if (line.children[0]?.type === "element") {
                    const node = line.children[0].children[0];
                    if (node?.type === "text") {
                      const diffType =
                        node.value[0] === "+"
                          ? "add"
                          : node.value[0] === "-"
                            ? "remove"
                            : undefined;
                      if (diffType) {
                        line.properties["class"] += ` diff ${diffType}`;
                        node.value = node.value.substring(1);
                      }
                    }
                  }
                },
              },
            ],
          }),
        ).replace(
          /^\s*<pre([\S\s]*)\/pre>\s*$/m,
          (_, content) => `<div${content}/div>`,
        ),
      }}
    />
  );
}
