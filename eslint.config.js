// @ts-check

import eslint from "@eslint/js";
// @ts-expect-error eslint-plugin-import does indeed have a default export
import importPlugin from "eslint-plugin-import";
import importSortPlugin from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/dist/**", "**/cjs/**", "**/esm/**", "**/types/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
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
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", disallowTypeAnnotations: true },
      ],
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
    },
  },
  // @ts-expect-error type of `rules` is inferred incorrectly
  ...["core", "preact", "qwik", "react", "solid"].map(pkg => ({
    files: [`packages/${pkg}/**/*`],
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          peerDependencies: true,
          optionalDependencies: false,
          packageDir: `packages/${pkg}`,
        },
      ],
    },
  })),
  {
    files: ["commitlint.config.js", "eslint.config.js", "**/vite.config.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
);
