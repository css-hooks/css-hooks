import type { Element, Parent, Root, RootContent, Text } from "hast";
import { isElement } from "hast-util-is-element";
import type { CSSProperties } from "hastx/css";
import { styleObjectToString } from "hastx/css";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import * as V from "varsace";
import { z } from "zod";

type TagNamePluginOptions<T> = Partial<Record<keyof HTMLElementTagNameMap, T>> &
  (
    | {
        tablecell: (tagName: "td" | "th") => T;
        th?: undefined;
        td?: undefined;
      }
    | { tablecell?: undefined }
  ) &
  (
    | {
        heading: (level: 1 | 2 | 3 | 4 | 5 | 6) => T;
        h1?: undefined;
        h2?: undefined;
        h3?: undefined;
        h4?: undefined;
        h5?: undefined;
        h6?: undefined;
      }
    | { heading?: undefined }
  );

export const rehypeStyle: Plugin<
  [TagNamePluginOptions<CSSProperties>],
  Root
> = options => {
  return tree => {
    visit(tree, "element", node => {
      const { tagName } = node;
      if ((tagName === "th" || tagName === "td") && options.tablecell) {
        node.properties["style"] = styleObjectToString(
          options.tablecell(tagName),
        );
      } else if (/^h[1-6]$/.test(tagName) && options.heading) {
        const level = parseInt(tagName[1] || "1") as 1 | 2 | 3 | 4 | 5 | 6;
        node.properties["style"] = styleObjectToString(options.heading(level));
      } else if (tagName in options) {
        const style = options[tagName as keyof typeof options];
        if (typeof style === "object") {
          node.properties["style"] = styleObjectToString(style);
        }
      }
    });
  };
};

export const rehypeRewriteElement: Plugin<
  [
    Partial<Record<keyof HTMLElementTagNameMap, (node: Element) => void>> &
      (
        | {
            heading: (node: Element) => void;
            h1?: undefined;
            h2?: undefined;
            h3?: undefined;
            h4?: undefined;
            h5?: undefined;
            h6?: undefined;
          }
        | { heading?: undefined }
      ),
  ],
  Root
> = options => {
  return tree =>
    visit(tree, "element", node => {
      const { tagName } = node;
      const rewrite =
        /^h[1-6]$/.test(tagName) && "heading" in options
          ? options.heading
          : options[tagName as keyof typeof options];
      if (rewrite) {
        rewrite(node);
      }
    });
};

export const rehypeTransformHref: Plugin<
  [(href: string) => string],
  Root
> = transform => {
  return tree =>
    visit(tree, "element", node => {
      if (typeof node.properties["href"] === "string") {
        node.properties["href"] = transform(node.properties["href"]);
      }
    });
};

export const rehypeClassName: Plugin<
  [TagNamePluginOptions<string>],
  Root
> = options => {
  return tree =>
    visit(tree, "element", node => {
      const { tagName } = node;
      if ((tagName === "td" || tagName === "th") && options.tablecell) {
        node.properties["class"] = options.tablecell(tagName);
      } else if (/^h[1-6]$/.test(tagName) && options.heading) {
        node.properties["class"] = options.heading(
          parseInt(tagName[1] || "1") as 1 | 2 | 3 | 4 | 5 | 6,
        );
      } else if (tagName in options) {
        const option = options[tagName as keyof typeof options];
        if (typeof option === "string") {
          node.properties["class"] = option;
        }
      }
    });
};

export const findTextNode = (parent: Parent) =>
  isElement(parent)
    ? (function findTextNode(
        node: RootContent,
        index: number,
        parent: Parent,
      ):
        | {
            node: Text;
            index: number;
            parent: Parent;
          }
        | undefined {
        if (node.type === "text" && node.value.trim()) {
          return { node, index, parent };
        }
        if (node.type === "element") {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (child) {
              const text = findTextNode(child, i, node);
              if (text) {
                return text;
              }
            }
          }
        }
        return undefined;
      })(parent, -1, parent)
    : undefined;

export function withElement(x: unknown, f: (element: Element) => void) {
  if (isElement(x)) {
    f(x);
  }
}

export const rehypeAlerts: Plugin<[], Root> = () => {
  return tree =>
    visit(tree, "element", node => {
      if (node.tagName === "blockquote") {
        const text = findTextNode(node);
        if (text) {
          const match = text.node.value.match(/^\s*\[!(NOTE|WARNING)\]\s*(.*)/);
          if (match) {
            const type = z.enum(["NOTE", "WARNING"]).parse(match[1]);
            const restText = match[2];
            text.node["value"] = restText || "";
            withElement(
              <p style={{ margin: 0 }}>
                <strong
                  style={{
                    color: type === "WARNING" ? V.orange30 : V.blue30,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375em",
                  }}
                >
                  <svg
                    viewBox="0 0 16 16"
                    style={{
                      minWidth: "1em",
                      maxWidth: "1em",
                      minHeight: "1em",
                      maxHeight: "1em",
                      transform: "translateY(-0.0625em)",
                    }}
                  >
                    <path
                      fill="currentColor"
                      d={
                        type === "WARNING"
                          ? "M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                          : "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      }
                    />
                  </svg>
                  {`${type[0]}${type.substring(1).toLowerCase()}`}
                </strong>
              </p>,
              element => text.parent.children.splice(text.index, 0, element),
            );
          }
        }
      }
    });
};
