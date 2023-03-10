# Forbid usage of false literal inside object expressions of clsx (`clsx/forbid-false-inside-object-expressions`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce specific usage of object expressions inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/forbid-false-inside-object-expressions: 'error' */

const falseClasses = clsx({ 'dynamic-condition-class': condition, 'false-class': false });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/forbid-false-inside-object-expressions: 'error' */

const falseClasses = clsx({ 'dynamic-condition-class': condition });
```

## When Not To Use It

If you don't want to enforce specific usage of object expressions inside clsx
