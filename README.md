# eslint-plugin-clsx

An ESLint plugin for clsx/classnames

<!-- vscode-markdown-toc -->
* [Installation](#Installation)
* [Usage](#Usage)
* [Rules](#Rules)
* [Presets](#Presets)
  * [Preset usage](#Presetusage)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='Installation'></a>Installation

You'll first need to install [ESLint](https://eslint.org):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-clsx`:

```sh
npm install eslint-plugin-clsx --save-dev
```

## <a name='Usage'></a>Usage

Here's an example ESLint configuration that:

* Enables the `recommended` configuration
* Enables an optional/non-recommended rule

```json
{
    "extends": ["plugin:clsx/recommended"],
    "rules": {
        "clsx/no-redundant-clsx": "error"
    }
}
```

## <a name='Rules'></a>Rules

<!-- begin auto-generated rules list -->

⚠️ [Configurations](https://github.com/temoncher/eslint-plugin-clsx#presets) set to warn in.\
✅ Set in the `recommended` [configuration](https://github.com/temoncher/eslint-plugin-clsx#presets).\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                     | Description                                                  | ⚠️ | 🔧 |
| :----------------------------------------------------------------------- | :----------------------------------------------------------- | :- | :- |
| [forbid-array-literal](docs/rules/forbid-array-literal.md)               | forbid usage of array literals inside clsx                   | ✅  | 🔧 |
| [forbid-logical-expressions](docs/rules/forbid-logical-expressions.md)   | forbid usage of logical expressions inside clsx              |    |    |
| [forbid-object-literal-false](docs/rules/forbid-object-literal-false.md) | forbid usage of false literal inside object literals of clsx | ✅  | 🔧 |
| [forbid-object-literal-true](docs/rules/forbid-object-literal-true.md)   | forbid usage of true literal inside object literals of clsx  | ✅  | 🔧 |
| [no-redundant-clsx](docs/rules/no-redundant-clsx.md)                     | disallow redundant clsx usage                                | ✅  | 🔧 |

<!-- end auto-generated rules list -->

## <a name='Presets'></a>Presets

|   | Name | Description |
|:--|:-----|:------------|
| ✅ | `recommended` | enables all recommended rules in this plugin |
|   | `all` | enables all rules in this plugin |

### <a name='Presetusage'></a>Preset usage

Presets are enabled by adding a line to the `extends` list in your config file. For example, to enable the `recommended` preset, use:

```json
{
    "extends": ["plugin:clsx/recommended"]
}
```

## <a name='Settings'></a>Settings

This rule can optionally be configured with an object that represents imports that should be considered an clsx usage

```json
{
    "settings": {
        "clsxOptions": {
            "myclsx": "default"
        }
    }
}
```

Examples of **incorrect** code for the `{ myclsx: 'default' }` setting (with no-redundant-clsx rule enabled):

```js
import mc from 'myclsx';

const singleClass = mc('single-class');
```

Examples of **incorrect** code for the `{ myclsx: 'cn' }` setting (with no-redundant-clsx rule enabled):

```js
import { cn } from 'myclsx';

const singleClass = cn('single-class');
```

Examples of **incorrect** code for the `{ myclsx: ['default', 'cn'] }` setting (with no-redundant-clsx rule enabled):

```js
import mc, { cn } from 'myclsx';

// both report errors
const singleClass = cn('single-class');
const singleClass = mc('single-class');
```

Default setting value is `{ clsx: 'default', classnames: 'default' }`
