import { TSESTree } from '@typescript-eslint/types';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'forbid-array-expressions',
    defaultOptions: ['always' as 'onlySingleElement' | 'always'],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of array expressions inside clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ type: 'string', enum: ['onlySingleElement', 'always'] }],
        messages: {
            onlySingleElement: 'Single element arrays are forbidden inside clsx',
            always: 'Usage of array expressions inside clsx is forbidden',
        },
    },
    create(context, [ruleOptions]) {
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
                    .flatMap((clsxCallNode) => clsxCallNode.arguments)
                    .forEach((argumentNode) => {
                        if (argumentNode.type !== TSESTree.AST_NODE_TYPES.ArrayExpression) return;

                        if (ruleOptions === 'always') {
                            context.report({
                                messageId: 'always',
                                node: argumentNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        argumentNode,
                                        argumentNode.elements
                                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                            .map((el) => sourceCode.getText(el!))
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
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        sourceCode.getText(argumentNode.elements[0]!)
                                    ),
                            });
                        }
                    });
            },
        };
    },
});
