# Forbid usage of logical expressions inside clsx (`clsx/forbid-logical-expressions`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to forbid usage of logical expressions inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/forbid-logical-expressions: error */

const classWithLogicalExpression = clsx(true && 'single-class');
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/forbid-logical-expressions: error */

const classWithLogicalExpression = clsx('single-class');
```

## Options

### doNotAutofix (default)

Reports error but does not auto-fix it

### autofixToLogicalExpression

Reports error and auto-fixes logical expressions into object expression

```js
/* eslint clsx/forbid-logical-expressions: ['error', 'autofixToLogicalExpression'] */

const someClasses = clsx(true && false && 'class-1', condition && 'class-2');
// auto-fixes into
const someClasses = clsx({ 'class-1': true && false, 'class-2': condition });

```

## When Not To Use It

If you don't want to forbid usage of logical expressions inside clsx
