# Forbid usage of object expression inside clsx (`clsx/prefer-logical-over-objects`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to forbid usage of object expressions inside clsx

Examples of **incorrect** code for this rule:

```js
/* eslint clsx/prefer-logical-over-objects: error */

const objectLiteralClasses = clsx({ 'dynamic-condition-class': condition, 'third-class': true });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/prefer-logical-over-objects: error */

const objectLiteralClasses = clsx(condition && 'dynamic-condition-class', true && 'third-class');
```

## Options

This rule has an object option with two optional properties: "startingFrom" and "endingWith"

### startingFrom (default: 0)

Determines minimum number of properties on an object expression to report

Examples of **incorrect** code for `{ startingFrom: 2 }`:

```js
/* eslint clsx/prefer-objects-over-logical: ['error', { startingFrom: 2 }] */

const classes = clsx({ 'first-class': true, 'second-class': true }, 'some-class', { 'third-class': true });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/prefer-objects-over-logical: ['error', { startingFrom: 2 }] */

const classes = clsx(true && 'first-class', true && 'second-class', 'some-class', { 'third-class': true });
```

### endingWith (default: Infinity)

Determines maximum number of properties on an object expression to report

Examples of **incorrect** code for `{ endingWith: 1 }`:

```js
/* eslint clsx/prefer-objects-over-logical: ['error', { endingWith: 1 }] */

const classes = clsx({ 'first-class': true, 'second-class': true }, 'some-class', { 'third-class': true });
```

Examples of **correct** code for this rule:

```js
/* eslint clsx/prefer-objects-over-logical: ['error', { endingWith: 1 }] */

const classes = clsx({ 'first-class': true, 'second-class': true }, 'some-class', true && 'third-class');
```

## When Not To Use It

If you don't want to enforce usage of logical expressions over objects

## Related rules

- [https://github.com/temoncher/eslint-plugin-clsx/blob/main/docs/rules/prefer-objects-over-logical.md](prefer-objects-over-logical) - inverse of prefer-logical-over-objects
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
