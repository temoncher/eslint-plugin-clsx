// @ts-check
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
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
        /** @type {{ startingFrom: number, endingWith: number }} */
        const { startingFrom = 0, endingWith = Infinity } = context.options[0] ?? {};

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
                            if (chunk[0].type === 'SpreadElement') {
                                const spreadsArr = /** @type {import('estree').SpreadElement[]} */ (
                                    chunk
                                );
                                const spreadsText = spreadsArr
                                    .map((se) => sourceCode.getText(se))
                                    .join(', ');

                                return `{ ${spreadsText} }`;
                            }

                            const propsArr = /** @type {import('estree').Property[]} */ (chunk);

                            return propsArr
                                .map((prop) => {
                                    const keyText = sourceCode.getText(prop.key);
                                    const valueText = sourceCode.getText(prop.value);
                                    const key =
                                        !prop.computed && prop.key.type === 'Identifier'
                                            ? `'${keyText}'`
                                            : keyText;

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
