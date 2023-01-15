# Enforce specific usage of array literals inside clsx (`clsx/array-literal`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce specific usage of array literals inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/array-literal: error */

const singleClass = clsx(['single-class']);
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/array-literal: error */

const singleClass = clsx('single-class');
const twoClasses = clsx(['first-class', 'second-class']);
const classes = ['first-class', 'second-class'];
const dynamic = clsx('some-class', classes);
```

## Options

### forbidSingleElement (default)

Examples of **incorrect** code for the `forbidSingleElement` option:

```js
/* eslint clsx/array-literal: ['error', 'forbidSingleElement'] */

const singleClass = clsx(['single-class']);
```

Examples of **correct** code for the `forbidSingleElement` option:

```js
/* eslint clsx/array-literal: ['error', 'forbidSingleElement'] */

const singleClass = clsx('single-class');
const twoClasses = clsx(['first-class', 'second-class']);
const classes = ['first-class', 'second-class'];
const dynamic = clsx('some-class', classes);
```

### forbid

Examples of **incorrect** code for the `forbid` option:

```js
/* eslint clsx/array-literal: ['error', 'forbid'] */

const twoClasses = clsx(['first-class', 'second-class']);
```

Examples of **correct** code for the `forbid` option:

```js
/* eslint clsx/array-literal: ['error', 'forbid'] */

const singleClass = clsx('single-class');
const twoClasses = clsx('first-class', 'second-class');
const classes = ['first-class', 'second-class'];
const dynamic = clsx('some-class', classes);
```

## When Not To Use It

If you don't want to enforce specific usage of array literals inside clsx
