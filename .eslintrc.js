/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    reportUnusedDisableDirectives: true,
    rules: {
        'global-require': 0,
        'no-continue': 0,
        'no-case-declarations': 2,
        'prefer-destructuring': 1,
        'no-param-reassign': 2,
        'no-console': 2,
        'new-cap': [
            2,
            {
                capIsNewExceptions: ['When', 'Then', 'Given', 'Nothing', 'T', 'F', 'Module'],
                newIsCap: false,
                capIsNewExceptionPattern: 'UNSAFE',
            },
        ],
        'no-self-compare': 2,
        'no-irregular-whitespace': 2,
        'arrow-body-style': 1,
        complexity: [1, 7],
        'array-bracket-newline': [1, 'consistent'],
        'function-call-argument-newline': [1, 'consistent'],
        'func-style': [1, 'expression'],
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
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            extends: [
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:@typescript-eslint/strict',
                'airbnb-typescript/base',
                'plugin:import/typescript',
                'plugin:prettier/recommended',
            ],
            parserOptions: {
                project: './tsconfig.json',
            },
            rules: {
                '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_.*' }],
            },
        },
    ],
};
