// @ts-check
const partition = require('lodash/partition');
const utils = require('../utils');

/** @typedef {{ allowFalseLiterals: boolean, allowTrueLiterals: 'always' | 'insideObjectContainingOnlyLiterals' | 'never' }} ObjectLiteralRuleOptions */

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'enforce specific usage of object literals inside clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    allowFalseLiterals: { type: 'boolean' },
                    allowTrueLiterals: {
                        enum: ['always', 'insideObjectContainingOnlyLiterals', 'never'],
                    },
                },
            },
        ],
        messages: {
            trueLiterals: 'Object literal inside clsx should not contain true literals',
            falseLiterals: 'Object literal inside clsx should not contain false literals',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        /** @type {ObjectLiteralRuleOptions} */
        const {
            allowFalseLiterals = false,
            allowTrueLiterals = 'insideObjectContainingOnlyLiterals',
        } = context.options[0] ?? {
            allowFalseLiterals: false,
            allowTrueLiterals: 'insideObjectContainingOnlyLiterals',
        };

        return {
            ImportDeclaration(importNode) {
                const assignedClsxName = utils.findClsxImport(importNode, clsxOptions);

                if (!assignedClsxName) {
                    return;
                }

                const clsxUsages = utils.getClsxUsages(importNode, sourceCode, assignedClsxName);

                clsxUsages
                    .flatMap((clsxCallNode) => clsxCallNode.arguments)
                    // TODO: autofix deep into arrays
                    // eslint-disable-next-line complexity
                    .forEach((argumentNode) => {
                        if (argumentNode.type !== 'ObjectExpression') return;

                        if (allowTrueLiterals !== 'always') {
                            const [trueLiteralProps, otherProps] = partition(
                                argumentNode.properties,
                                (prop) =>
                                    prop.type === 'Property' &&
                                    prop.value.type === 'Literal' &&
                                    prop.value.value === true
                            );

                            if (
                                trueLiteralProps.length !== 0 &&
                                (allowTrueLiterals === 'never' ||
                                    (allowTrueLiterals === 'insideObjectContainingOnlyLiterals' &&
                                        otherProps.length === 0))
                            ) {
                                const trueLiteralPropsText =
                                    /** @type {import('estree').Property[]} */ (trueLiteralProps)
                                        .map((el) => sourceCode.getText(el.key))
                                        .join(', ');
                                const otherPropsText = otherProps
                                    .map((prop) => sourceCode.getText(prop))
                                    .join(', ');
                                const otherPropsWrappedInObject = otherPropsText
                                    ? `{ ${otherPropsText} }`
                                    : undefined;

                                context.report({
                                    messageId: 'trueLiterals',
                                    node: argumentNode,
                                    fix: (fixer) =>
                                        fixer.replaceText(
                                            argumentNode,
                                            [trueLiteralPropsText, otherPropsWrappedInObject]
                                                .filter(Boolean)
                                                .join(', ')
                                        ),
                                });

                                return;
                            }
                        }

                        if (!allowFalseLiterals) {
                            const propsWithoutFalseLiterals = argumentNode.properties.filter(
                                (prop) =>
                                    !(
                                        prop.type === 'Property' &&
                                        prop.value.type === 'Literal' &&
                                        prop.value.value === false
                                    )
                            );

                            if (
                                propsWithoutFalseLiterals.length !== argumentNode.properties.length
                            ) {
                                const propsText = propsWithoutFalseLiterals
                                    .map((prop) => sourceCode.getText(prop))
                                    .join(', ');

                                context.report({
                                    messageId: 'trueLiterals',
                                    node: argumentNode,
                                    fix: (fixer) =>
                                        fixer.replaceText(argumentNode, `{ ${propsText} }`),
                                });
                            }
                        }
                    });
            },
        };
    },
};
