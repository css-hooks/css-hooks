import { _stringifyValue as stringifyCSSValue } from "@css-hooks/react";
import type { Root } from "hast";
import type { CSSProperties } from "react";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type TagNamePluginOptions<T> = Partial<Record<keyof HTMLElementTagNameMap, T>> &
  (
    | {
        tablecell: (tagName: "td" | "th") => T;
        th?: undefined;
        td?: undefined;
      }
    | { tablecell?: undefined }
  );

const styleObjectToString = (properties: CSSProperties) =>
  Object.entries(properties)
    .map(
      ([propertyName, value]) =>
        `${propertyName.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`)}:${stringifyCSSValue(value, propertyName)}`,
    )
    .join(";");

export const rehypeClassName: Plugin<
  [TagNamePluginOptions<string>],
  Root
> = options => {
  return tree =>
    visit(tree, "element", node => {
      const { tagName } = node;
      if ((tagName === "td" || tagName === "th") && options.tablecell) {
        node.properties["class"] = options.tablecell(tagName);
      } else if (tagName in options) {
        const option = options[tagName as keyof typeof options];
        if (typeof option === "string") {
          node.properties["class"] = option;
        }
      }
    });
};

const filenameCommentPattern =
  /^\/\/[ \t]+((?:[\w.-]+\/)*[\w.-]+\.(?:[cm]?[jt]sx?|css|html|json))[ \t]*(?:\r?\n(?:[ \t]*\r?\n)?|$)/;

export function extractFilename(code: string) {
  const match = code.match(filenameCommentPattern);
  return {
    code: match ? code.substring(match[0].length) : code,
    filename: match?.[1],
  };
}

// Group adjacent top-level file blocks before rehype-raw discards fence metadata.
export const rehypeSandpack: Plugin<[Record<string, string>[]], Root> =
  sandpacks => tree => {
    let files: Record<string, string> | undefined;
    tree.children = tree.children.flatMap(node => {
      if (node.type === "text" && !node.value.trim()) return [node];
      const code = node.type === "element" ? node.children[0] : undefined;
      if (
        node.type !== "element" ||
        node.tagName !== "pre" ||
        code?.type !== "element" ||
        code.tagName !== "code" ||
        code.data?.meta !== "sandpack"
      ) {
        files = undefined;
        return [node];
      }
      const source = code.children
        .filter(child => child.type === "text")
        .map(child => child.value)
        .join("");
      const { code: content, filename } = extractFilename(source);
      if (!filename) throw new Error("Sandpack files need a filename comment.");
      const path = `/${filename}`;
      if (files) {
        if (Object.hasOwn(files, path))
          throw new Error(`Duplicate Sandpack file: ${filename}`);
        files[path] = content;
        return [];
      }
      files = { [path]: content };
      node.tagName = "div";
      node.properties = { dataSandpack: sandpacks.push(files) - 1 };
      node.children = [];
      return [node];
    });
  };

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
      } else if (tagName in options) {
        const style = options[tagName as keyof typeof options];
        if (typeof style === "object") {
          node.properties["style"] = styleObjectToString(style);
        }
      }
    });
  };
};
