# Forbid usage of array literals inside clsx (`clsx/forbid-array-literal`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to forbid usage of array literals inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/forbid-array-literal: error */

const singleClass = clsx(['single-class']);
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/forbid-array-literal: error */

const singleClass = clsx('single-class');
const twoClasses = clsx(['first-class', 'second-class']);
const classes = ['first-class', 'second-class'];
const dynamic = clsx('some-class', classes);
```

## Options

### always (default)

Examples of **incorrect** code for the `always` option:

```js
/* eslint clsx/forbid-array-literal: ['error', 'always'] */

const twoClasses = clsx(['first-class', 'second-class']);
```

Examples of **correct** code for the `always` option:

```js
/* eslint clsx/forbid-array-literal: ['error', 'always'] */

const singleClass = clsx('single-class');
const twoClasses = clsx('first-class', 'second-class');
const classes = ['first-class', 'second-class'];
const dynamic = clsx('some-class', classes);
```

### onlySingleElement

Examples of **incorrect** code for the `onlySingleElement` option:

```js
/* eslint clsx/forbid-array-literal: ['error', 'onlySingleElement'] */

const singleClass = clsx(['single-class']);
```

Examples of **correct** code for the `onlySingleElement` option:

```js
/* eslint clsx/forbid-array-literal: ['error', 'onlySingleElement'] */

const singleClass = clsx('single-class');
const twoClasses = clsx(['first-class', 'second-class']);
const classes = ['first-class', 'second-class'];
const dynamic = clsx('some-class', classes);
```

## When Not To Use It

If you don't want to enforce specific usage of array literals inside clsx
