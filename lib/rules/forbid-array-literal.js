// @ts-check
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid array literal usage inside clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ enum: ['forbidSingle', 'forbidAny'] }],
        messages: {
            default: 'clsx usage is redundant',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        const arrayConfigurationOption = context.options[0] ?? 'forbidSingle';

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

                        if (arrayConfigurationOption === 'forbidAny') {
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
                            arrayConfigurationOption === 'forbidSingle' &&
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
