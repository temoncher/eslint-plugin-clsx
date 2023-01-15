// @ts-check
const utils = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of logical expressions inside clsx',
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
            default: 'Usage of object expressions is preferred over logical expressions',
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
                    .map((clsxCallNode) => ({
                        clsxCallNode,
                        usageChunks: utils.chunkBy(
                            clsxCallNode.arguments,
                            (argumentNode) => argumentNode.type
                        ),
                    }))
                    .forEach(({ clsxCallNode, usageChunks }) => {
                        if (
                            !usageChunks.some(
                                (chunk) =>
                                    chunk[0].type === 'LogicalExpression' &&
                                    chunk.length >= startingFrom &&
                                    chunk.length < endingWith
                            )
                        )
                            return;

                        const args = usageChunks.map((chunk) => {
                            if (chunk[0].type === 'LogicalExpression') {
                                const logicalExpressions =
                                    /** @type {import('estree').LogicalExpression[]} */ (chunk);
                                const newObjectPropsText = logicalExpressions
                                    .map((prop) => {
                                        const keyText =
                                            prop.right.type === 'Literal' &&
                                            typeof prop.right.value === 'string'
                                                ? prop.right.value
                                                : `[${sourceCode.getText(prop.right)}]`;
                                        const valueText = sourceCode.getText(prop.left);

                                        return `${keyText}: ${valueText}`;
                                    })
                                    .join(', ');

                                return `{ ${newObjectPropsText} }`;
                            }

                            return chunk.map((el) => sourceCode.getText(el)).join(', ');
                        });

                        context.report({
                            messageId: 'default',
                            node: clsxCallNode,
                            fix: (fixer) =>
                                fixer.replaceText(
                                    clsxCallNode,
                                    `${clsxCallNode.callee.name}(${args.join(', ')})`
                                ),
                        });
                    });
            },
        };
    },
};
