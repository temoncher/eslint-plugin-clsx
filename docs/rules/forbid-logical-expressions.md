# Forbid usage of logical expressions inside clsx (`clsx/forbid-logical-expressions`)

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

## When Not To Use It

If you don't want to forbid usage of logical expressions inside clsx
