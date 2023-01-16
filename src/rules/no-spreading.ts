import type { Rule } from 'eslint';
import type { Property, SpreadElement } from 'estree';
import * as utils from '../utils';

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of object expression inside clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ type: 'array', items: { enum: ['object'] } }],
        messages: {
            default: 'Usage of object expression inside clsx is forbidden',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        const forbiddenFor = (context.options[0] as ['object'] | undefined) ?? ['object'];

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
                            argumentNode.type === 'ObjectExpression' &&
                            argumentNode.properties.some((prop) => prop.type === 'SpreadElement')
                        ) {
                            const alternatingSpreadsAndProps = utils.chunkBy(
                                argumentNode.properties,
                                (prop) => prop.type === 'Property'
                            );

                            const args = alternatingSpreadsAndProps.map((chunk) => {
                                if (chunk[0]!.type === 'SpreadElement') {
                                    const spreadsArr = chunk as SpreadElement[];

                                    return spreadsArr
                                        .map((se) => sourceCode.getText(se.argument))
                                        .join(', ');
                                }

                                const propsArr = chunk as Property[];
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
};

export = rule;
