import { TSESTree } from '@typescript-eslint/types';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'prefer-objects-over-logical',
    defaultOptions: [{ startingFrom: 0, endingWith: 999 }],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of logical expressions inside clsx',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    startingFrom: { type: 'number' },
                    endingWith: { type: 'number' },
                },
            },
        ],
        messages: {
            default: 'Usage of object expressions is preferred over logical expressions',
        },
    },
    create(context, [{ startingFrom, endingWith }]) {
        const { sourceCode } = context;
        const clsxOptions = utils.extractClsxOptions(context);

        return {
            ImportDeclaration(importNode) {
                const assignedClsxName = utils.findClsxImport(importNode, clsxOptions);

                if (!assignedClsxName) {
                    return;
                }

                const clsxUsages = utils.getClsxUsages(importNode, sourceCode, assignedClsxName);

                clsxUsages
                    .map((clsxCallNode) => ({
                        clsxCallNode,
                        usageChunks: utils.chunkBy(
                            clsxCallNode.arguments,
                            (argumentNode) => argumentNode.type
                        ),
                    }))
                    .forEach(({ clsxCallNode, usageChunks }) => {
                        if (
                            !usageChunks.some(
                                (chunk) =>
                                    chunk[0]?.type === TSESTree.AST_NODE_TYPES.LogicalExpression &&
                                    chunk.length >= startingFrom &&
                                    chunk.length < endingWith
                            )
                        ) {
                            return;
                        }

                        const args = usageChunks.map((chunk) => {
                            if (chunk[0]?.type === TSESTree.AST_NODE_TYPES.LogicalExpression) {
                                const logicalExpressions = chunk as TSESTree.LogicalExpression[];
                                const newObjectPropsText = logicalExpressions
                                    .map((prop) => {
                                        const keyText =
                                            prop.right.type === TSESTree.AST_NODE_TYPES.Literal &&
                                            typeof prop.right.value === 'string'
                                                ? `"${prop.right.value}"`
                                                : `[${sourceCode.getText(prop.right)}]`;
                                        const valueText = sourceCode.getText(prop.left);

                                        return `${keyText}: ${valueText}`;
                                    })
                                    .join(', ');

                                return `{ ${newObjectPropsText} }`;
                            }

                            return chunk.map((el) => sourceCode.getText(el)).join(', ');
                        });

                        context.report({
                            messageId: 'default',
                            node: clsxCallNode,
                            fix: (fixer) =>
                                fixer.replaceText(
                                    clsxCallNode,
                                    `${clsxCallNode.callee.name}(${args.join(', ')})`
                                ),
                        });
                    });
            },
        };
    },
});
