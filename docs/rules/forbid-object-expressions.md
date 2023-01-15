# Forbid usage of object expression inside clsx (`clsx/forbid-object-expressions`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to forbid usage of object expressions inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/forbid-object-expressions: error */

const objectLiteralClasses = clsx({ 'dynamic-condition-class': condition, 'true-class': true });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/forbid-object-expressions: error */

const objectLiteralClasses = clsx(condition && 'dynamic-condition-class', true && 'true-class');
```

## Options

### doNotAutofix (default)

Reports error but does not auto-fix it

### autofixToLogicalExpression

Reports error and auto-fixes object expression into logical expressions

```js
/* eslint clsx/forbid-object-expressions: ['error', 'autofixToLogicalExpression'] */

const someClasses = clsx({ 'dynamic-condition-class': condition, 'true-class': true });
// auto-fixes into
const someClasses = clsx(condition && 'dynamic-condition-class', true && 'true-class');
```

## When Not To Use It

If you don't want to forbid usage of object expressions inside clsx
