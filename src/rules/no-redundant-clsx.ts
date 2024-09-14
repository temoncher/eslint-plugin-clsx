import { TSESTree } from '@typescript-eslint/types';

import { createRule } from '../createRule';
import * as utils from '../utils';

/** checks if firstArg is e.g. `styles.foo` (if cssModuleNames includes 'styles') */
function firstArgIsCssModule(cssModuleNames: string[], firstArg?: TSESTree.Node) {
    return (
        cssModuleNames.length &&
        firstArg?.type === TSESTree.AST_NODE_TYPES.MemberExpression &&
        firstArg.object.type === TSESTree.AST_NODE_TYPES.Identifier &&
        cssModuleNames.includes(firstArg.object.name)
    );
}

export = createRule({
    name: 'no-redundant-clsx',
    defaultOptions: [{ cssModuleNames: [] }],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow redundant clsx usage',
            recommended: true,
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    cssModuleNames: {
                        type: 'array',
                        items: { type: 'string' },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            default: 'clsx usage is redundant',
        },
    },
    create(context, [{ cssModuleNames }]) {
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
                        firstArg?.type === TSESTree.AST_NODE_TYPES.TemplateLiteral ||
                        firstArgIsCssModule(cssModuleNames, firstArg)
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
