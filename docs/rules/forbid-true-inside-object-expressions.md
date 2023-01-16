# Forbid usage of true literal inside object expressions of clsx (`clsx/forbid-true-inside-object-expressions`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to forbid usage of true literals inside object expressions of clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/forbid-true-inside-object-expressions: error */

const trueClasses = clsx({ 'true-class-1': true, 'true-class-2': true });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/forbid-true-inside-object-expressions: error */

const trueClasses = clsx('true-class-1', 'true-class-2');
const dynamicClasses = clsx({ 'dynamic-condition-class': condition });
```

## Options

### allowMixed (default)

Examples of **incorrect** code for the `allowMixed` option:

```js
/* eslint clsx/forbid-true-inside-object-expressions: ['error', 'allowMixed'] */

const trueClasses = clsx({ 'true-class-1': true, 'true-class-2': true });
```

Examples of **correct** code for the `allowMixed` option:

```js
/* eslint clsx/forbid-true-inside-object-expressions: ['error', 'allowMixed'] */

const trueClasses = clsx('true-class-1', 'true-class-2');
const trueClasses2 = clsx({ 'dynamic-condition-class': condition, 'true-class-2': true });
```

### always

Examples of **incorrect** code for the `always` option:

```js
/* eslint clsx/forbid-true-inside-object-expressions: ['error', 'always'] */

const trueClasses = clsx({ 'true-class-1': true, 'true-class-2': true });
const trueClasses2 = clsx({ 'dynamic-condition-class': condition, 'true-class-2': true });
```

Examples of **correct** code for the `always` option:

```js
/* eslint clsx/forbid-true-inside-object-expressions: ['error', 'always'] */

const trueClasses = clsx('true-class-1', 'true-class-2');
const trueClasses2 = clsx('true-class-2', { 'dynamic-condition-class': condition });
```

## When Not To Use It

If you don't want to forbid usage of true literals inside object expressions of clsx
