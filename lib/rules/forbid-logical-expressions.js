// @ts-check
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of logical expressions inside clsx',
        },
        fixable: 'code',
        schema: [{ enum: ['doNotAutofix', 'autofixToObjectExpression'] }],
        messages: {
            default: 'Usage of logical expressions inside clsx is forbidden',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        /** @type {'doNotAutofix' | 'autofixToObjectExpression'} */
        const autofixMode = context.options[0] ?? 'doNotAutofix';

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
                        if (argumentNode.type !== 'LogicalExpression') return;

                        if (autofixMode === 'doNotAutofix') {
                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                            });

                            return;
                        }

                        if (autofixMode === 'autofixToObjectExpression') {
                            const classText = sourceCode.getText(argumentNode.right);
                            const conditionText = sourceCode.getText(argumentNode.left);

                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        argumentNode,
                                        `{ [${classText}]: ${conditionText} }`
                                    ),
                            });
                        }
                    });
            },
        };
    },
};
