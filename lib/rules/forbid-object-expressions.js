// @ts-check
const partition = require('lodash/partition');
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
                            const [spreads, props] = partition(
                                argumentNode.properties,
                                /** @type {(p) => p is import('estree').SpreadElement} */ (
                                    (prop) => prop.type === 'SpreadElement'
                                )
                            );

                            const logicalExpressionsText =
                                props.length === 0
                                    ? undefined
                                    : props
                                          .map(
                                              (prop) =>
                                                  `${sourceCode.getText(
                                                      prop.value
                                                  )} && ${sourceCode.getText(prop.key)}`
                                          )
                                          .join(', ');
                            const spreadsText =
                                spreads.length === 0
                                    ? undefined
                                    : spreads.map((se) => sourceCode.getText(se)).join(', ');
                            const spreadsTextWrappedInObject = spreadsText
                                ? `{ ${spreadsText} }`
                                : undefined;

                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        argumentNode,
                                        [logicalExpressionsText, spreadsTextWrappedInObject]
                                            .filter(utils.isDefined)
                                            .join(', ')
                                    ),
                            });
                        }
                    });
            },
        };
    },
};
