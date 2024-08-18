import typescriptEslint from '@typescript-eslint/eslint-plugin';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import importEslint from 'eslint-plugin-import';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  { ignores: ['**/dist/', '**/node_modules/'] },
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  {
    plugins: {
      import: fixupPluginRules(importEslint),
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      globals: { ...globals.node },
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    files: ['src/**/*.ts'],
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
      'newline-before-return': 'error',
      'prefer-destructuring': 'error',
      'newline-after-var': ['error', 'always'],
      'no-duplicate-imports': ['error', { includeExports: true }],
      'import/newline-after-import': 'error',
      'import/first': ['error', 'absolute-first'],
      'import/order': ['error', { 'newlines-between': 'always' }],
    },
  },
];
