import { TSESTree } from '@typescript-eslint/types';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'prefer-merged-neighboring-elements',
    defaultOptions: ['object' as const],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'enforce merging of neighboring elements',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ type: 'array', items: { type: 'string', enum: ['object'] } }],
        messages: {
            object: 'Neighboring objects should be merged',
        },
    },
    create(context, [mergedFor]) {
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
                    // TODO: autofix deep into arrays
                    .forEach(({ clsxCallNode, usageChunks }) => {
                        if (
                            mergedFor.includes('object') &&
                            usageChunks.some(
                                (chunk) =>
                                    chunk[0]?.type === TSESTree.AST_NODE_TYPES.ObjectExpression &&
                                    chunk.length > 1
                            )
                        ) {
                            const args = usageChunks.map((chunk) => {
                                if (chunk[0]?.type === TSESTree.AST_NODE_TYPES.ObjectExpression) {
                                    const objectsArr = chunk as TSESTree.ObjectExpression[];
                                    const newObjectPropsText = objectsArr
                                        .flatMap((se) => se.properties)
                                        .map((prop) => sourceCode.getText(prop))
                                        .join(', ');

                                    return `{ ${newObjectPropsText} }`;
                                }

                                return chunk.map((el) => sourceCode.getText(el)).join(', ');
                            });

                            context.report({
                                messageId: 'object',
                                node: clsxCallNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        clsxCallNode,
                                        `${clsxCallNode.callee.name}(${args.join(', ')})`
                                    ),
                            });
                        }

                        // TODO: add support for arrays and strings
                    });
            },
        };
    },
});
