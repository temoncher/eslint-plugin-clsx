// @ts-check
const partition = require('lodash/partition');
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of true literal inside object literals of clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ enum: ['always', 'allowMixed'] }],
        messages: {
            default: 'Object literal inside clsx should not contain true literals',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        /** @type {'always' | 'allowMixed'} */
        const allowTrueLiterals = context.options[0] ?? 'allowMixed';

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
                    .forEach((argumentNode) => {
                        if (argumentNode.type !== 'ObjectExpression') return;

                        const [trueLiteralProps, otherProps] = partition(
                            argumentNode.properties,
                            (prop) =>
                                prop.type === 'Property' &&
                                prop.value.type === 'Literal' &&
                                prop.value.value === true
                        );

                        if (
                            trueLiteralProps.length !== 0 &&
                            (allowTrueLiterals === 'always' ||
                                (allowTrueLiterals === 'allowMixed' && otherProps.length === 0))
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
                                messageId: 'default',
                                node: argumentNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        argumentNode,
                                        [trueLiteralPropsText, otherPropsWrappedInObject]
                                            .filter(Boolean)
                                            .join(', ')
                                    ),
                            });
                        }
                    });
            },
        };
    },
};
