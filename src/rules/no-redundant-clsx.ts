import type { Rule } from 'eslint';
import * as utils from '../utils';

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow redundant clsx usage',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            default: 'clsx usage is redundant',
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

                clsxUsages.forEach((clsxCallNode) => {
                    if (clsxCallNode.arguments.length !== 1) {
                        return;
                    }

                    const firstArg = clsxCallNode.arguments[0];

                    if (firstArg?.type === 'Literal') {
                        context.report({
                            messageId: 'default',
                            node: clsxCallNode,
                            fix: (fixer) => fixer.replaceText(clsxCallNode, firstArg.raw!),
                        });
                    }

                    // ? TODO: clsx(['some-class']) -> 'some-class'
                    // ? TODO: clsx({ 'some-class': true }) -> 'some-class'
                });
            },
        };
    },
};

export = rule;
