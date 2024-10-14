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
