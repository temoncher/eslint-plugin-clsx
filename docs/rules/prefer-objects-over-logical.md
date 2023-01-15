# Forbid usage of logical expressions inside clsx (`clsx/prefer-objects-over-logical`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to forbid usage of logical expressions inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/prefer-objects-over-logical: error */

const classWithLogicalExpression = clsx(true && 'single-class');
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/prefer-objects-over-logical: error */

const classWithLogicalExpression = clsx('single-class');
```

## Options

This rule has an object option with two optional properties: "startingFrom" and "endingWith"

### startingFrom (default: 0)

Determines minimum number of consequent logical expressions to report

Examples of **incorrect** code for `{ startingFrom: 2 }`:

```js
/* eslint clsx/prefer-objects-over-logical: ['error', { startingFrom: 2 }] */

const classes = clsx(true && 'first-class', true && 'second-class', 'some-class', true && 'third-class');
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/prefer-objects-over-logical: ['error', { startingFrom: 2 }] */

const classes = clsx({ 'first-class': true, 'second-class': true }, 'some-class', true && 'third-class');
```

### endingWith (default: Infinity)

Determines maximum number of consequent logical expressions to report

Examples of **incorrect** code for `{ endingWith: 1 }`:

```js
/* eslint clsx/prefer-objects-over-logical: ['error', { endingWith: 1 }] */

const classes = clsx(true && 'first-class', true && 'second-class', 'some-class', true && 'third-class');
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/prefer-objects-over-logical: ['error', { endingWith: 1 }] */

const classes = clsx(true && 'first-class', true && 'second-class', 'some-class', { 'third-class': true });
```

## When Not To Use It

If you don't want to enforce usage of objects over logical expressions

## Related rules

- [https://github.com/temoncher/eslint-plugin-clsx/blob/main/docs/rules/prefer-logical-over-objects.md](prefer-logical-over-objects) - inverse of prefer-objects-over-logical
    Can be combined to achieve logical for 0-2 elements and objects for larger (>2) elements

    Examples of **incorrect** code :

    ```js
    /* eslint clsx/prefer-logical-over-objects: ['error', { endingWith: 3 }] */
    /* eslint clsx/prefer-objects-over-logical: ['error', { startingFrom: 3 }] */

    const classes = clsx(true && 'first-class', true && 'second-class', 'some-class', { 'third-class': true });
    ```

    Examples of **correct** code :

    ```js
    /* eslint clsx/prefer-logical-over-objects: ['error', { endingWith: 3 }] */
    /* eslint clsx/prefer-objects-over-logical: ['error', { startingFrom: 3 }] */

    const classes = clsx({ 'first-class': true, 'second-class': true }, 'some-class', true && 'third-class');
    ```
