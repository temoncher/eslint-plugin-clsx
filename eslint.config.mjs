import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX, createNodeResolver } from 'eslint-plugin-import-x';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['node_modules/', 'dist/']),
    {
        extends: [
            tseslint.configs.recommended,
            importX.flatConfigs.recommended,
            prettierRecommended,
        ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        rules: {
            'global-require': 0,
            'no-continue': 0,
            'no-case-declarations': 2,
            'prefer-destructuring': 1,
            'no-param-reassign': 2,
            'no-console': 2,
            'no-self-compare': 2,
            'no-irregular-whitespace': 2,
            'arrow-body-style': 1,
            complexity: [1, 7],
            'array-bracket-newline': [1, 'consistent'],
            'function-call-argument-newline': [1, 'consistent'],
            'func-style': [1, 'declaration'],
            'prefer-exponentiation-operator': 2,

            'padding-line-between-statements': [
                1,
                {
                    blankLine: 'always',
                    prev: ['const', 'let', 'var'],
                    next: '*',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: ['if', 'try', 'class', 'export'],
                },
                {
                    blankLine: 'always',
                    prev: ['if', 'try', 'class', 'export'],
                    next: '*',
                },
                {
                    blankLine: 'any',
                    prev: ['const', 'let', 'var', 'export'],
                    next: ['const', 'let', 'var', 'export'],
                },
                {
                    blankLine: 'always',
                    prev: ['expression'],
                    next: ['const', 'let', 'var'],
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: ['return'],
                },
            ],

            'arrow-spacing': 1,

            'no-restricted-exports': [
                1,
                {
                    restrictedNamedExports: ['default', 'then'],
                },
            ],

            'import-x/order': [
                1,
                {
                    groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
                    pathGroupsExcludedImportTypes: ['constants'],
                    'newlines-between': 'always',

                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: false,
                    },

                    warnOnUnassignedImports: true,
                },
            ],

            'import-x/prefer-default-export': 0,
            'import-x/extensions': 0,
            'import-x/no-unresolved': 0,
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.strict,
            importX.flatConfigs.typescript,
            prettierRecommended,
        ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        settings: {
            'import-x/resolver-next': [createTypeScriptImportResolver(), createNodeResolver()],
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_.*' }],
        },
    },
]);
