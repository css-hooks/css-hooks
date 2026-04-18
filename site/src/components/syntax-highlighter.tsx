import type { Element } from "hast";
import type { CSSProperties } from "react";
import { use } from "react";
import { pipe, piped } from "remeda";
import type { ThemeRegistrationRaw } from "shiki";
import { codeToHtml } from "shiki";

import { dark, merge, on, parseStyle, stringifyStyle } from "../css.ts";
import {
  blue,
  gray,
  orange,
  pink,
  purple,
  teal,
  yellow,
} from "../design/colors.ts";

const darkTheme: ThemeRegistrationRaw = {
  name: "css-hooks-dark",
  type: "dark",
  colors: {
    "editor.background": purple(90),
    "editor.foreground": gray(15),
  },
  settings: [
    // Default text
    { settings: { foreground: gray(15) } },

    // Comments — muted, recede into the background
    {
      scope: ["comment"],
      settings: { foreground: gray(40), fontStyle: "italic" },
    },

    // Punctuation — subtle, doesn't compete with tokens
    {
      scope: ["punctuation"],
      settings: { foreground: gray(45) },
    },

    // Strings → purple (JS-specific requirement)
    {
      scope: ["string"],
      settings: { foreground: purple(30) },
    },

    // Regex → orange, distinct from plain strings
    {
      scope: ["string.regexp"],
      settings: { foreground: orange(35) },
    },

    // Numbers → yellow
    {
      scope: ["constant.numeric"],
      settings: { foreground: yellow(35) },
    },

    // Language constants (true, false, null, undefined) → orange
    {
      scope: ["constant.language"],
      settings: { foreground: orange(40) },
    },

    // Named constants (ALL_CAPS, enum members, etc.) → orange
    {
      scope: ["constant.other", "variable.other.constant"],
      settings: { foreground: orange(35) },
    },

    // Control-flow keywords (if, else, return, for, while, …) → pink italic
    {
      scope: ["keyword.control"],
      settings: { foreground: pink(30), fontStyle: "italic" },
    },

    // Other keywords and word-form operators (new, typeof, instanceof, …) → pink
    {
      scope: ["keyword"],
      settings: { foreground: pink(35) },
    },

    // Storage (const, let, var, function, class, async, static, …) → pink
    {
      scope: ["storage.type", "storage.modifier"],
      settings: { foreground: pink(35) },
    },

    // Symbolic operators (=, +, ===, &&, …) → blue
    {
      scope: ["keyword.operator"],
      settings: { foreground: blue(40) },
    },

    // Variables — near-white default
    {
      scope: ["variable"],
      settings: { foreground: gray(20) },
    },

    // Parameters — slightly dimmer than variables
    {
      scope: ["variable.parameter"],
      settings: { foreground: gray(30) },
    },

    // Property access (obj.foo) → blue
    {
      scope: ["variable.other.property"],
      settings: { foreground: blue(35) },
    },

    // Object literal keys and CSS property names → blue
    {
      scope: ["meta.object-literal.key", "support.type.property-name"],
      settings: { foreground: blue(30) },
    },

    // Function names (definitions and calls) → blue, prominent
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: blue(25) },
    },

    // Types, classes, interfaces, enums → teal
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.name.interface",
        "entity.name.enum",
        "support.type",
        "support.class",
      ],
      settings: { foreground: teal(30) },
    },

    // Generic type parameters → lighter teal
    {
      scope: ["entity.name.type.parameter"],
      settings: { foreground: teal(35) },
    },

    // Primitive type keywords (string, number, boolean as annotations) → teal
    {
      scope: ["support.type.primitive", "storage.type.primitive"],
      settings: { foreground: teal(35) },
    },

    // JSX/HTML tag names → pink
    {
      scope: ["entity.name.tag"],
      settings: { foreground: pink(35) },
    },

    // JSX/HTML attribute names → purple
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: purple(30) },
    },

    // Decorators → orange
    {
      scope: ["meta.decorator", "punctuation.decorator"],
      settings: { foreground: orange(35) },
    },

    // Diff: added → teal, removed → pink
    {
      scope: ["markup.inserted", "punctuation.definition.inserted"],
      settings: { foreground: teal(35) },
    },
    {
      scope: ["markup.deleted", "punctuation.definition.deleted"],
      settings: { foreground: pink(35) },
    },
  ],
};

const lightTheme: ThemeRegistrationRaw = {
  name: "css-hooks-light",
  type: "light",
  colors: {
    "editor.background": gray(10),
    "editor.foreground": gray(80),
  },
  settings: [
    // Default text
    { settings: { foreground: gray(80) } },

    // Comments — muted, recede into the background
    {
      scope: ["comment"],
      settings: { foreground: gray(55), fontStyle: "italic" },
    },

    // Punctuation — subtle, doesn't compete with tokens
    {
      scope: ["punctuation"],
      settings: { foreground: gray(60) },
    },

    // Strings → purple
    {
      scope: ["string"],
      settings: { foreground: purple(65) },
    },

    // Regex → orange, distinct from plain strings
    {
      scope: ["string.regexp"],
      settings: { foreground: orange(60) },
    },

    // Numbers → yellow (deep enough to read on light bg)
    {
      scope: ["constant.numeric"],
      settings: { foreground: yellow(65) },
    },

    // Language constants (true, false, null, undefined) → orange
    {
      scope: ["constant.language"],
      settings: { foreground: orange(60) },
    },

    // Named constants (ALL_CAPS, enum members, etc.) → orange
    {
      scope: ["constant.other", "variable.other.constant"],
      settings: { foreground: orange(60) },
    },

    // Control-flow keywords (if, else, return, for, while, …) → pink italic
    {
      scope: ["keyword.control"],
      settings: { foreground: pink(55), fontStyle: "italic" },
    },

    // Other keywords and word-form operators (new, typeof, …) → pink
    {
      scope: ["keyword"],
      settings: { foreground: pink(60) },
    },

    // Storage (const, let, var, function, class, async, static, …) → pink
    {
      scope: ["storage.type", "storage.modifier"],
      settings: { foreground: pink(60) },
    },

    // Symbolic operators (=, +, ===, &&, …) → blue
    {
      scope: ["keyword.operator"],
      settings: { foreground: blue(60) },
    },

    // Variables — dark gray default
    {
      scope: ["variable"],
      settings: { foreground: gray(75) },
    },

    // Parameters — slightly lighter than variables
    {
      scope: ["variable.parameter"],
      settings: { foreground: gray(70) },
    },

    // Property access (obj.foo) → blue
    {
      scope: ["variable.other.property"],
      settings: { foreground: blue(60) },
    },

    // Object literal keys and CSS property names → blue
    {
      scope: ["meta.object-literal.key", "support.type.property-name"],
      settings: { foreground: blue(65) },
    },

    // Function names (definitions and calls) → blue, prominent
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: blue(55) },
    },

    // Types, classes, interfaces, enums → teal
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.name.interface",
        "entity.name.enum",
        "support.type",
        "support.class",
      ],
      settings: { foreground: teal(55) },
    },

    // Generic type parameters → lighter teal
    {
      scope: ["entity.name.type.parameter"],
      settings: { foreground: teal(60) },
    },

    // Primitive type keywords (string, number, boolean as annotations) → teal
    {
      scope: ["support.type.primitive", "storage.type.primitive"],
      settings: { foreground: teal(60) },
    },

    // JSX/HTML tag names → pink
    {
      scope: ["entity.name.tag"],
      settings: { foreground: pink(60) },
    },

    // JSX/HTML attribute names → purple
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: purple(60) },
    },

    // Decorators → orange
    {
      scope: ["meta.decorator", "punctuation.decorator"],
      settings: { foreground: orange(55) },
    },

    // Diff: added → teal, removed → pink
    {
      scope: ["markup.inserted", "punctuation.definition.inserted"],
      settings: { foreground: teal(60) },
    },
    {
      scope: ["markup.deleted", "punctuation.definition.deleted"],
      settings: { foreground: pink(60) },
    },
  ],
};

const mutateStyle =
  (f: (baseStyle: CSSProperties) => CSSProperties) => (el: Element) => {
    const styleAttr = el.properties["style"];
    const baseStyle: CSSProperties =
      typeof styleAttr === "string" ? parseStyle(styleAttr) : {};
    el.properties["style"] = pipe(baseStyle, f, stringifyStyle);
  };

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
            themes: { light: lightTheme, dark: darkTheme },
            defaultColor: false,
            transformers: [
              {
                code: mutateStyle(piped(merge({ font: "inherit" }))),
              },
              {
                pre(el) {
                  el.tagName = "div";
                  delete el.properties["tabindex"];
                },
              },
              {
                span: mutateStyle(
                  piped(
                    merge({
                      color: "var(--shiki-light)",
                    }),
                    on(dark, {
                      color: "var(--shiki-dark)",
                    }),
                  ),
                ),
              },
            ],
          }),
        ),
      }}
    />
  );
}
