# Forbid usage of true literal inside object literals of clsx (`clsx/forbid-object-literal-true`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce specific usage of object literals inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/forbid-object-literal-true: error */

const trueClass = clsx({ 'true-class-1': true, 'true-class-2': true });
const falseClass = clsx({ 'dynamic-condition-class': condition, 'false-class': false });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/forbid-object-literal-true: error */

const trueClass = clsx('true-class-1', 'true-class-2');
const falseClass = clsx({ 'dynamic-condition-class': condition });
```

## Options

### allowMixed (default)

Examples of **incorrect** code for the `allowMixed` option:

```js
/* eslint clsx/forbid-object-literal-true: ['error', 'allowMixed'] */

const trueClass = clsx({ 'true-class-1': true, 'true-class-2': true });
```

Examples of **correct** code for the `allowMixed` option:

```js
/* eslint clsx/forbid-object-literal-true: ['error', 'allowMixed'] */

const trueClass = clsx('true-class-1', 'true-class-2');
const trueClass2 = clsx({ 'dynamic-condition-class': condition, 'true-class-2': true });
```

### always

Examples of **incorrect** code for the `always` option:

```js
/* eslint clsx/object-literal: ['error', 'always'  */

const trueClass = clsx({ 'true-class-1': true, 'true-class-2': true });
const trueClass2 = clsx({ 'dynamic-condition-class': condition, 'true-class-2': true });
```

Examples of **correct** code for the `always` option:

```js
/* eslint clsx/object-literal: ['error', 'always'  */

const trueClass = clsx('true-class-1', 'true-class-2');
const trueClass2 = clsx('true-class-2', { 'dynamic-condition-class': condition });
```

## When Not To Use It

If you don't want to enforce specific usage of object literals inside clsx
