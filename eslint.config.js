import js from '@eslint/js';
import angular from 'angular-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '**/coverage/',
      '**/dist/',
      '**/node_modules/',
      '**/.angular/',
      '**/index.html',
      'projects/angularjs-whats-new/**',
    ],
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,

    rules: {
      // Both components deliberately opt into eager change detection; revisit
      // the OnPush migration separately instead of blocking lint on it.
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
    },
  },
  {
    // `directive-selector`/`component-selector` are TS rules — they read the
    // decorator metadata, so the `@angular-eslint` plugin is only in scope here.
    files: ['projects/ngx-whats-new/src/**/*.ts'],

    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          style: 'camelCase',
        },
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ngx',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*component.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
  {
    files: ['**/*.component.html'],
    rules: {
      '@typescript-eslint/ban-ts-comment': ['off'],
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },
  eslintConfigPrettier
);
