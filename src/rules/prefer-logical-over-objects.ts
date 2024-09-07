import { TSESTree } from '@typescript-eslint/types';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'prefer-logical-over-objects',
    defaultOptions: [{ startingFrom: 0, endingWith: 999 }],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of object expression inside clsx',
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
            default: 'Usage of logical expressions is preferred over object expressions',
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
                    .flatMap((clsxCallNode) => clsxCallNode.arguments)
                    // TODO: autofix deep into arrays
                    .forEach((argumentNode) => {
                        if (
                            argumentNode.type !== TSESTree.AST_NODE_TYPES.ObjectExpression ||
                            argumentNode.properties.length < startingFrom ||
                            argumentNode.properties.length >= endingWith
                        )
                            return;

                        const alternatingSpreadsAndProps = utils.chunkBy(
                            argumentNode.properties,
                            (prop) => prop.type === TSESTree.AST_NODE_TYPES.Property
                        );

                        const args = alternatingSpreadsAndProps.map((chunk) => {
                            if (chunk[0]?.type === TSESTree.AST_NODE_TYPES.SpreadElement) {
                                const spreadsArr = chunk as TSESTree.SpreadElement[];
                                const spreadsText = spreadsArr
                                    .map((se) => sourceCode.getText(se))
                                    .join(', ');

                                return `{ ${spreadsText} }`;
                            }

                            const propsArr = chunk as TSESTree.Property[];

                            return propsArr
                                .map((prop) => {
                                    const keyText = sourceCode.getText(prop.key);
                                    const valueText = sourceCode.getText(prop.value);
                                    const key =
                                        !prop.computed &&
                                        prop.key.type === TSESTree.AST_NODE_TYPES.Identifier
                                            ? `'${keyText}'`
                                            : keyText;

                                    // TODO: apply `()` conditionally only as needed
                                    return `(${valueText}) && ${key}`;
                                })
                                .join(', ');
                        });

                        if (
                            argumentNode.properties.every(
                                (prop) => prop.type === TSESTree.AST_NODE_TYPES.SpreadElement
                            )
                        ) {
                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                            });

                            return;
                        }

                        context.report({
                            messageId: 'default',
                            node: argumentNode,
                            fix: (fixer) => fixer.replaceText(argumentNode, args.join(', ')),
                        });
                    });
            },
        };
    },
});
