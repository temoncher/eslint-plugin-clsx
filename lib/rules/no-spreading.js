// @ts-check
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
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
        /** @type {('object')[]} */
        const forbiddenFor = context.options[0] ?? ['object'];

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
                                if (chunk[0].type === 'SpreadElement') {
                                    const spreadsArr =
                                        /** @type {import('estree').SpreadElement[]} */ (chunk);

                                    return spreadsArr
                                        .map((se) => sourceCode.getText(se.argument))
                                        .join(', ');
                                }

                                const propsArr = /** @type {import('estree').Property[]} */ (chunk);
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
