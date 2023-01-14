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

* Sets `sourceType` to `script` for CJS plugins (most users) (use `module` for ESM/TypeScript)
* Enables the `recommended` configuration
* Enables an optional/non-recommended rule

```json
{
    "parserOptions": {
        "sourceType": "script"
    },
    "extends": [
        "plugin:eslint-plugin/recommended"
    ],
    "rules": {
        "eslint-plugin/require-meta-docs-description": "error"
    }
}
```

## <a name='Rules'></a>Rules

<!-- begin auto-generated rules list -->

⚠️ [Configurations](https://github.com/temoncher/eslint-plugin-clsx#presets) set to warn in.\
✅ Set in the `recommended` [configuration](https://github.com/temoncher/eslint-plugin-clsx#presets).\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                 | Description                   | ⚠️ | 🔧 |
| :--------------------------------------------------- | :---------------------------- | :- | :- |
| [no-redundant-clsx](docs/rules/no-redundant-clsx.md) | disallow redundant clsx usage | ✅  | 🔧 |

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
    "extends": [
        "plugin:clsx/recommended"
    ]
}
```
