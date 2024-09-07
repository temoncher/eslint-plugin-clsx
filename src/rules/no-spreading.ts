import { TSESTree } from '@typescript-eslint/types';

import { createRule } from '../createRule';
import * as utils from '../utils';

export = createRule({
    name: 'no-spreading',
    defaultOptions: ['object' as const],
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of object expression inside clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ type: 'array', items: { type: 'string', enum: ['object'] } }],
        messages: {
            default: 'Usage of object expression inside clsx is forbidden',
        },
    },
    create(context, [forbiddenFor]) {
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
                            forbiddenFor.includes('object') &&
                            argumentNode.type === TSESTree.AST_NODE_TYPES.ObjectExpression &&
                            argumentNode.properties.some(
                                (prop) => prop.type === TSESTree.AST_NODE_TYPES.SpreadElement
                            )
                        ) {
                            const alternatingSpreadsAndProps = utils.chunkBy(
                                argumentNode.properties,
                                (prop) => prop.type === TSESTree.AST_NODE_TYPES.Property
                            );

                            const args = alternatingSpreadsAndProps.map((chunk) => {
                                if (chunk[0]?.type === TSESTree.AST_NODE_TYPES.SpreadElement) {
                                    const spreadsArr = chunk as TSESTree.SpreadElement[];

                                    return spreadsArr
                                        .map((se) => sourceCode.getText(se.argument))
                                        .join(', ');
                                }

                                const propsArr = chunk as TSESTree.Property[];
                                const propsText = propsArr
                                    .map((prop) => {
                                        const keyText = sourceCode.getText(prop.key);
                                        const valueText = sourceCode.getText(prop.value);

                                        return `${
                                            prop.computed ? `[${keyText}]` : keyText
                                        }: ${valueText}`;
                                    })
                                    .join(', ');

                                return `{ ${propsText} }`;
                            });

                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                                fix: (fixer) => fixer.replaceText(argumentNode, args.join(', ')),
                            });
                        }

                        // TODO: add support for arrays
                    });
            },
        };
    },
});
