# Disallow redundant clsx usage (`clsx/no-redundant-clsx`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to restrict unnecessary usage of clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/no-redundant-clsx: error */

const singleClasses = clsx('single-class');
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/no-redundant-clsx: error */

const singleClasses = 'single-class';
const twoClasseses = clsx('first-class', 'second-class')
```

## When Not To Use It

If you're ok with clsx used redundantly
