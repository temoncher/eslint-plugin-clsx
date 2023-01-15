// @ts-check
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'enforce specific usage of array literals inside clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ enum: ['forbidSingleElement', 'forbid'] }],
        messages: {
            default: 'clsx usage is redundant',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        const arrayConfigurationOption = context.options[0] ?? 'forbidSingleElement';

        return {
            ImportDeclaration(importNode) {
                const assignedClsxName = utils.findClsxImport(importNode, clsxOptions);

                if (!assignedClsxName) {
                    return;
                }

                const clsxUsages = utils.getClsxUsages(importNode, sourceCode, assignedClsxName);

                clsxUsages
                    .flatMap((clsxCallNode) => clsxCallNode.arguments)
                    .forEach((argumentNode) => {
                        if (argumentNode.type !== 'ArrayExpression') return;

                        if (arrayConfigurationOption === 'forbid') {
                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        argumentNode,
                                        argumentNode.elements
                                            .map((el) => sourceCode.getText(el))
                                            .join(', ')
                                    ),
                            });

                            return;
                        }

                        if (
                            arrayConfigurationOption === 'forbidSingleElement' &&
                            argumentNode.elements.length === 1
                        ) {
                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        argumentNode,
                                        sourceCode.getText(argumentNode.elements[0])
                                    ),
                            });
                        }
                    });
            },
        };
    },
};
