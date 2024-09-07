import { TSESTree } from '@typescript-eslint/types';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'no-redundant-clsx',
    defaultOptions: [],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow redundant clsx usage',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
        messages: {
            default: 'clsx usage is redundant',
        },
    },
    create(context) {
        const { sourceCode } = context;
        const clsxOptions = utils.extractClsxOptions(context);

        return {
            ImportDeclaration(importNode) {
                const assignedClsxName = utils.findClsxImport(importNode, clsxOptions);

                if (!assignedClsxName) {
                    return;
                }

                const clsxUsages = utils.getClsxUsages(importNode, sourceCode, assignedClsxName);

                clsxUsages.forEach((clsxCallNode) => {
                    if (clsxCallNode.arguments.length !== 1) {
                        return;
                    }

                    // eslint-disable-next-line prefer-destructuring
                    const firstArg = clsxCallNode.arguments[0];

                    if (
                        firstArg?.type === TSESTree.AST_NODE_TYPES.Literal ||
                        firstArg?.type === TSESTree.AST_NODE_TYPES.TemplateLiteral
                    ) {
                        context.report({
                            messageId: 'default',
                            node: clsxCallNode,
                            fix: (fixer) =>
                                fixer.replaceText(clsxCallNode, sourceCode.getText(firstArg)),
                        });
                    }

                    // ? TODO: clsx(['some-class']) -> 'some-class'
                    // ? TODO: clsx({ 'some-class': true }) -> 'some-class'
                });
            },
        };
    },
});
