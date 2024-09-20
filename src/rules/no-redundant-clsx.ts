import { query } from 'esquery';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'no-redundant-clsx',
    defaultOptions: [{ selector: ':matches(Literal, TemplateLiteral)' }],
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
                    selector: { type: 'string' },
                },
            },
        ],
        messages: {
            default: 'clsx usage is redundant',
        },
    },
    create(context, [{ selector }]) {
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

                    if (query(firstArg as import('estree').Node, selector).length > 0) {
                        context.report({
                            messageId: 'default',
                            node: clsxCallNode,
                            fix: (fixer) =>
                                fixer.replaceText(clsxCallNode, sourceCode.getText(firstArg)),
                        });
                    }
                });
            },
        };
    },
});
