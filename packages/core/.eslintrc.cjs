/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended"],
  plugins: ["@typescript-eslint", "compat"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  root: true,
  overrides: [
    {
      files: ["src/index.js"],
      extends: ["plugin:compat/recommended"],
    },
    {
      files: ["src/**/*.ts"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
    },
    {
      files: ["src/**/*.test.*"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      rules: {
        "@typescript-eslint/no-floating-promises": "off",
      },
    },
  ],
};
