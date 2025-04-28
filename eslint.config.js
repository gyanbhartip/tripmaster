import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as reactHooks from 'eslint-plugin-react-hooks';
import * as eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        plugins: { js, eslintPluginPrettier },
        extends: ['js/recommended'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    reactHooks.configs.recommended,
]);
