import { TSESTree } from '@typescript-eslint/types';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'forbid-false-inside-object-expressions',
    defaultOptions: [],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of false literal inside object expressions of clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
        messages: {
            falseLiterals: 'Object expression inside clsx should not contain false literals',
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

                clsxUsages
                    .flatMap((clsxCallNode) => clsxCallNode.arguments)
                    // TODO: autofix deep into arrays
                    .forEach((argumentNode) => {
                        if (argumentNode.type !== TSESTree.AST_NODE_TYPES.ObjectExpression) return;

                        const propsWithoutFalseLiterals = argumentNode.properties.filter(
                            (prop) =>
                                !(
                                    prop.type === TSESTree.AST_NODE_TYPES.Property &&
                                    prop.value.type === TSESTree.AST_NODE_TYPES.Literal &&
                                    prop.value.value === false
                                )
                        );

                        if (propsWithoutFalseLiterals.length !== argumentNode.properties.length) {
                            const propsText = propsWithoutFalseLiterals
                                .map((prop) => sourceCode.getText(prop))
                                .join(', ');

                            context.report({
                                messageId: 'falseLiterals',
                                node: argumentNode,
                                fix: (fixer) => fixer.replaceText(argumentNode, `{ ${propsText} }`),
                            });
                        }
                    });
            },
        };
    },
});
