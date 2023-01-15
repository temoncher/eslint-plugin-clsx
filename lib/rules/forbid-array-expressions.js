// @ts-check
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of array expressions inside clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ enum: ['onlySingleElement', 'always'] }],
        messages: {
            onlySingleElement: 'Single element arrays are forbidden inside clsx',
            always: 'Usage of array expressions inside clsx is forbidden',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        const ruleOptions = context.options[0] ?? 'always';

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

                        if (ruleOptions === 'always') {
                            context.report({
                                messageId: 'always',
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
                            ruleOptions === 'onlySingleElement' &&
                            argumentNode.elements.length === 1
                        ) {
                            context.report({
                                messageId: 'onlySingleElement',
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
