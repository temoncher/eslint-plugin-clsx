// @ts-check
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of logical expressions inside clsx',
        },
        fixable: undefined,
        schema: [],
        messages: {
            forbid: 'Usage of logical expressions inside clsx is forbidden',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);

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

                        context.report({
                            messageId: 'forbid',
                            node: argumentNode,
                        });
                    });
            },
        };
    },
};
