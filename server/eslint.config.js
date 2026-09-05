import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // 1. Tell ESLint to inherit default JavaScript recommendations
  eslint.configs.recommended,

  // 2. Add recommended TypeScript rule checks
  ...tseslint.configs.recommendedTypeChecked,

  // 3. Customize rules or target specific folders
  {
    rules: {
      "no-console": "warn", // Warns you if you leave console.logs behind
      "@typescript-eslint/no-explicit-any": "warn", // Discourages using the 'any' type
    },
  },
);
