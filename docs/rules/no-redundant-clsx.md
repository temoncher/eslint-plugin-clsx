# Disallow redundant clsx usage (`clsx/no-redundant-clsx`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to restrict unnecessary usage of clsx

Examples of **incorrect** code for this rule:

```js
/* eslint eslint-plugin/consistent-output: error */

const singleClass = clsx('single-class');
```

Examples of **correct** code for this rule:

```js
/* eslint eslint-plugin/consistent-output: error */

const singleClass = 'single-class';
const twoClasses = clsx('first-class', 'second-class')
```

## Options

This rule takes an optional object that represents imports that should be considered an clsx usage

Default value is `{ clsx: 'default', classnames: 'default' }`

Examples of **incorrect** code for the `{ myclsx: 'default' }` option:

```js
/* eslint eslint-plugin/consistent-output: ['error', { myclsx: 'default' }] */
import mc from 'myclsx';

const singleClass = mc('single-class');
```

Examples of **incorrect** code for the `{ myclsx: 'cn' }` option:

```js
/* eslint eslint-plugin/consistent-output: ['error', { myclsx: 'cn' }] */
import { cn } from 'myclsx';

const singleClass = cn('single-class');
```

## When Not To Use It

If you're ok with clsx used redundantly
