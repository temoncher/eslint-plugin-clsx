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
const twoClasses = clsx('first-class', 'second-class')
```

## Options

This rule has an object option with one optional property: "cssModuleNames"

### cssModuleNames (default: [])

Specify variable names that should be treated as CSS module imports. This is useful for catching redundant clsx usage with CSS modules.

Examples of **incorrect** code for `{ cssModuleNames: ['styles'] }`:

```js
/* eslint 'clsx/no-redundant-clsx': ['error', { cssModuleNames: ['styles'] }] */

const singleClasses = clsx(styles.singleClass);
```

Examples of **correct** code for `{ cssModuleNames: ['styles'] }`:

```js
/* eslint 'clsx/no-redundant-clsx': ['error', { cssModuleNames: ['styles'] }] */

const singleClass = styles.singleClass
const twoClasses = clsx(styles.firstClass, styles.secondClass);
```

## When Not To Use It

If you're ok with clsx used redundantly
