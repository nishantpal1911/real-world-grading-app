import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import globals from 'globals';
import importEslint from 'eslint-plugin-import';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import prettierConfig from 'eslint-config-prettier';

export default [
  { ignores: ['**/dist/', '**/node_modules/'] },
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      import: fixupPluginRules(importEslint),
      '@typescript-eslint': typescriptEslint,
      'sort-destructure-keys': sortDestructureKeys,
      'no-relative-import-paths': noRelativeImportPaths,
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
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-var': 'error',
      'no-unused-vars': 'off',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
      'newline-before-return': 'error',
      'prefer-destructuring': 'error',
      'no-duplicate-imports': ['error', { includeExports: true }],
      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
      // Plugins
      'import/newline-after-import': 'error',
      'import/first': ['error', 'absolute-first'],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [{ pattern: 'src/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          warnOnUnassignedImports: true,
        },
      ],
      'sort-destructure-keys/sort-destructure-keys': 2,
      '@typescript-eslint/no-unused-vars': 'error',
      'no-relative-import-paths/no-relative-import-paths': 'error',
    },
  },
  prettierConfig,
];
