// eslint.config.js
const nextPlugin = require("@next/eslint-plugin-next");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
    {
        ignores: ["node_modules/**", ".next/**", "dist/**"],
    },
    {
        files: ["**/*.{js,ts,jsx,tsx}"],
        languageOptions: {
            parser: tsParser,
        },
        plugins: {
            "@next/next": nextPlugin,
            "unused-imports": require("eslint-plugin-unused-imports"),
        },
        rules: {
            // Regras herdadas do Next.js
            ...nextPlugin.configs["core-web-vitals"].rules,

            // Regras para limpar código não usado
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
];
