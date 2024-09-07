import { TSESTree } from '@typescript-eslint/types';
import * as R from 'remeda';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'forbid-true-inside-object-expressions',
    defaultOptions: ['allowMixed' as 'always' | 'allowMixed'],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of true literal inside object expressions of clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ type: 'string', enum: ['always', 'allowMixed'] }],
        messages: {
            default: 'Object expression inside clsx should not contain true literals',
        },
    },
    create(context, [allowTrueLiterals]) {
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

                        const [trueLiteralProps, otherProps] = R.partition(
                            argumentNode.properties,
                            (prop) =>
                                prop.type === TSESTree.AST_NODE_TYPES.Property &&
                                prop.value.type === TSESTree.AST_NODE_TYPES.Literal &&
                                prop.value.value === true
                        );

                        if (
                            trueLiteralProps.length !== 0 &&
                            (allowTrueLiterals === 'always' ||
                                (allowTrueLiterals === 'allowMixed' && otherProps.length === 0))
                        ) {
                            const trueLiteralPropsText = (trueLiteralProps as TSESTree.Property[])
                                .map((el) => {
                                    const keyText = sourceCode.getText(el.key);

                                    return el.computed ? keyText : `'${keyText}'`;
                                })
                                .join(', ');
                            const otherPropsText = otherProps
                                .map((prop) => sourceCode.getText(prop))
                                .join(', ');
                            const otherPropsWrappedInObject = otherPropsText
                                ? `{ ${otherPropsText} }`
                                : undefined;

                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        argumentNode,
                                        [trueLiteralPropsText, otherPropsWrappedInObject]
                                            .filter(R.isDefined)
                                            .join(', ')
                                    ),
                            });
                        }
                    });
            },
        };
    },
});
