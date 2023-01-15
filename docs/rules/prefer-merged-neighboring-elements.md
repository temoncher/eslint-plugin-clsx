# Enforce merging of neighboring elements (`clsx/prefer-merged-neighboring-elements`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to reduce consequent elements into one inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/prefer-merged-neighboring-elements: 'error' */

const objectClasses = clsx({ ...firstObj }, { ...secondObj }, { 'class-1': true , 'class-2': true }, someObj, { 'class-3': true && true });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/prefer-merged-neighboring-elements: error */

const objectClasses = clsx({ ...firstObj, ...secondObj, 'class-1': true , 'class-2': true }, someObj, { 'class-3': true && true });
```

## Options

The rule accepts an array of following values

### object

Examples of **incorrect** code for the `['object']` option:

```js
/* eslint clsx/prefer-merged-neighboring-elements: ['error', ['object']] */

const objectClasses = clsx({ ...firstObj }, { ...secondObj }, { 'class-1': true , 'class-2': true }, someObj, { 'class-3': true && true });
```

Examples of **correct** code for the `['object']` option:

```js
/* eslint clsx/prefer-merged-neighboring-elements: ['error', ['object']] */

const objectClasses = clsx({ ...firstObj, ...secondObj, 'class-1': true , 'class-2': true }, someObj, { 'class-3': true && true });
```

Default value is `['object']`

## When Not To Use It

If you don't want to reduce consequent elements into one inside clsx
