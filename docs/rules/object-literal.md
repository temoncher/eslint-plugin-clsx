# Enforce specific usage of object literals inside clsx (`clsx/object-literal`)

⚠️ This rule _warns_ in the ✅ `recommended` [config](https://github.com/temoncher/eslint-plugin-clsx#presets).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce specific usage of object literals inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/object-literal: error */

const trueClass = clsx({ 'true-class-1': true, 'true-class-2': true });
const falseClass = clsx({ 'dynamic-condition-class': condition, 'false-class': false });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/object-literal: error */

const trueClass = clsx('true-class-1', 'true-class-2');
const falseClass = clsx({ 'dynamic-condition-class': condition });
```

## Options

### allowFalseLiterals (default: false)

Examples of **incorrect** code for the `{ allowFalseLiterals: false }` option:

```js
/* eslint clsx/object-literal: ['error', { allowFalseLiterals: false }] */

const falseClass = clsx({ 'dynamic-condition-class': condition, 'false-class': false });
```

Examples of **correct** code for the `{ allowFalseLiterals: false }` option:

```js
/* eslint clsx/object-literal: ['error', { allowFalseLiterals: false }] */

const falseClass = clsx({ 'dynamic-condition-class': condition });
```

### allowTrueLiterals (default: insideObjectContainingOnlyLiterals)

Examples of **incorrect** code for the `{ allowTrueLiterals: 'insideObjectContainingOnlyLiterals' }` option:

```js
/* eslint clsx/object-literal: ['error', { allowTrueLiterals: 'insideObjectContainingOnlyLiterals' }] */

const trueClass = clsx({ 'true-class-1': true, 'true-class-2': true });
```

Examples of **correct** code for the `{ allowTrueLiterals: 'insideObjectContainingOnlyLiterals' }` option:

```js
/* eslint clsx/object-literal: ['error', { allowTrueLiterals: 'insideObjectContainingOnlyLiterals' }] */

const trueClass = clsx('true-class-1', 'true-class-2');
const trueClass2 = clsx({ 'dynamic-condition-class': condition, 'true-class-2': true });
```

Examples of **incorrect** code for the `{ allowTrueLiterals: 'never' }` option:

```js
/* eslint clsx/object-literal: ['error', { allowTrueLiterals: 'never' }] */

const trueClass = clsx({ 'true-class-1': true, 'true-class-2': true });
const trueClass2 = clsx({ 'dynamic-condition-class': condition, 'true-class-2': true });
```

Examples of **correct** code for the `{ allowTrueLiterals: 'never' }` option:

```js
/* eslint clsx/object-literal: ['error', { allowTrueLiterals: 'never' }] */

const trueClass = clsx('true-class-1', 'true-class-2');
const trueClass2 = clsx('true-class-2', { 'dynamic-condition-class': condition });
```

Examples of **correct** code for the `{ allowTrueLiterals: 'always' }` option:

```js
/* eslint clsx/object-literal: ['error', { allowTrueLiterals: 'always' }] */

const trueClass = clsx({ 'true-class-1': true, 'true-class-2': true });
const trueClass2 = clsx({ 'dynamic-condition-class': condition, 'true-class-2': true });
```

## When Not To Use It

If you don't want to enforce specific usage of object literals inside clsx
