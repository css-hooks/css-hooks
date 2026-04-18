// @ts-check

import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import importSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportPlugin from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "**/cjs/**",
      "**/esm/**",
      "**/types/**",
      "node_modules",
      "site/.react-router/**",
      "site/build/**",
    ],
  },
  {
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
      "simple-import-sort": importSortPlugin,
      "unused-imports": unusedImportPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", disallowTypeAnnotations: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "import/consistent-type-specifier-style": "error",
      "import/extensions": ["error", "ignorePackages"],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-absolute-path": "error",
      "import/no-amd": "error",
      "import/no-default-export": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          peerDependencies: true,
          optionalDependencies: false,
        },
      ],
      "import/no-mutable-exports": "error",
      "import/no-named-default": "error",
      "import/no-named-export": "off", // we want everything to be a named export
      "import/no-self-import": "error",
      "import/prefer-default-export": "off", // we want everything to be named
      "simple-import-sort/imports": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: [`packages/**/*`],
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          peerDependencies: true,
          optionalDependencies: false,
        },
      ],
    },
  },
  {
    files: ["commitlint.config.js", "eslint.config.js", "**/vite.config.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    files: ["site/**"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    files: ["site/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/function-component-definition": "error",
    },
  },
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  prettierConfig,
);
