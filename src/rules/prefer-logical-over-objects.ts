import type { Rule } from 'eslint';
import type { Property, SpreadElement } from 'estree';
import * as utils from '../utils';

const rule: Rule.RuleModule = {
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
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        const { startingFrom = 0, endingWith = Infinity } =
            (context.options[0] as { startingFrom: number; endingWith: number } | undefined) ?? {};

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
                            argumentNode.type !== 'ObjectExpression' ||
                            argumentNode.properties.length < startingFrom ||
                            argumentNode.properties.length >= endingWith
                        )
                            return;

                        const alternatingSpreadsAndProps = utils.chunkBy(
                            argumentNode.properties,
                            (prop) => prop.type === 'Property'
                        );

                        const args = alternatingSpreadsAndProps.map((chunk) => {
                            if (chunk[0]!.type === 'SpreadElement') {
                                const spreadsArr = chunk as SpreadElement[];
                                const spreadsText = spreadsArr
                                    .map((se) => sourceCode.getText(se))
                                    .join(', ');

                                return `{ ${spreadsText} }`;
                            }

                            const propsArr = chunk as Property[];

                            return propsArr
                                .map((prop) => {
                                    const keyText = sourceCode.getText(prop.key);
                                    const valueText = sourceCode.getText(prop.value);
                                    const key =
                                        !prop.computed && prop.key.type === 'Identifier'
                                            ? `'${keyText}'`
                                            : keyText;

                                    // TODO: apply `()` conditionally only as needed
                                    return `(${valueText}) && ${key}`;
                                })
                                .join(', ');
                        });

                        if (
                            argumentNode.properties.every((prop) => prop.type === 'SpreadElement')
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
};

export = rule;
