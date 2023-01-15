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
        schema: [{ enum: ['doNotAutofix', 'autofixToLogicalExpression'] }],
        messages: {
            default: 'Usage of object expression inside clsx is forbidden',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        /** @type {'doNotAutofix' | 'autofixToLogicalExpression'} */
        const autofixMode = context.options[0] ?? 'doNotAutofix';

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
                        if (argumentNode.type !== 'ObjectExpression') return;

                        if (autofixMode === 'doNotAutofix') {
                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                            });

                            return;
                        }

                        if (autofixMode === 'autofixToLogicalExpression') {
                            const alternatingSpreadsAndProps = utils.chunkBy(
                                argumentNode.properties,
                                (prop) => prop.type === 'Property'
                            );

                            const args = alternatingSpreadsAndProps.map((arr) => {
                                if (arr[0].type === 'SpreadElement') {
                                    const spreadsArr =
                                        /** @type {import('estree').SpreadElement[]} */ (arr);
                                    const spreadsText = spreadsArr
                                        .map((se) => sourceCode.getText(se))
                                        .join(', ');

                                    return `{ ${spreadsText} }`;
                                }

                                const propsArr = /** @type {import('estree').Property[]} */ (arr);

                                return propsArr
                                    .map((prop) => {
                                        const keyText = sourceCode.getText(prop.key);
                                        const valueText = sourceCode.getText(prop.value);

                                        return `(${valueText}) && ${
                                            prop.computed ? keyText : `'${keyText}'`
                                        }`;
                                    })
                                    .join(', ');
                            });

                            if (
                                argumentNode.properties.every(
                                    (prop) => prop.type === 'SpreadElement'
                                )
                            ) {
                                context.report({
                                    messageId: 'default',
                                    node: argumentNode,
                                });
                            } else {
                                context.report({
                                    messageId: 'default',
                                    node: argumentNode,
                                    fix: (fixer) =>
                                        fixer.replaceText(argumentNode, args.join(', ')),
                                });
                            }
                        }
                    });
            },
        };
    },
};
