import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  eslintConfigPrettier,
  {
    ignores: ["**/node_modules/**", "dist/**"],
  },
  {
    files: ["webpack.*.js"],
    languageOptions: {
      globals: {
        ...globals.node, // Add Node.js globals (require, process, etc.)
      },
      parserOptions: {
        sourceType: "script", // Critical for CommonJS
      },
    },
    rules: {
      // Webpack-specific rule relaxations
      "import/no-extraneous-dependencies": "off", // Webpack uses devDependencies
      "no-undef": "off", // Node globals are already handled
    },
  },
];