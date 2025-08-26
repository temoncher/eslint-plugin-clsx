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

## Options

This rule has an object option with one optional property: "selector"

### selector

"selector" accepts [esquery selector](https://eslint.org/docs/latest/extend/selectors) to apply to signle argument of `clsx` usage. If argument matches this selector clsx usage is considered redundant

Examples of **incorrect** code for the `{ selector: ":matches(Literal, TemplateLiteral, MemberExpression[object.name="styles"])" }` option:

```js
/* eslint clsx/no-redundant-clsx: ['error', { selector: ":matches(Literal, TemplateLiteral, MemberExpression[object.name="styles"])" }] */

const classes = clsx(styles.myStyle);
```

Examples of **correct** code for the `{ selector: ":matches(Literal, TemplateLiteral, MemberExpression[object.name="styles"])" }` option:

```js
/* eslint clsx/no-redundant-clsx: ['error', { selector: ":matches(Literal, TemplateLiteral, MemberExpression[object.name="styles"])" }] */

const classes = styles.myStyle;
```

Default value is `{ selector: ":matches(Literal, TemplateLiteral)" }`

## When Not To Use It

If you're ok with clsx used redundantly
