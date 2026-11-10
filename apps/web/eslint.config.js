import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "build", ".react-router", "src/components/ui"]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      tseslint.configs.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/routes/**/*.{ts,tsx}", "src/root.tsx"],
    rules: {
      "react-refresh/only-export-components": [
        "error",
        {
          allowConstantExport: true,
          allowCompoundComponents: true,
          allowExportNames: [
            "meta",
            "links",
            "headers",
            "handle",
            "loader",
            "clientLoader",
            "action",
            "clientAction",
            "shouldRevalidate",
            "middleware",
            "clientMiddleware",
          ],
        },
      ],
    },
  },
]);
