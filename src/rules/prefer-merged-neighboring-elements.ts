import type { Rule } from 'eslint';
import { ObjectExpression } from 'estree';
import * as utils from '../utils';

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'enforce merging of neighboring elements',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ type: 'array', items: { enum: ['object'] } }],
        messages: {
            object: 'Neighboring objects should be merged',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        const mergedFor = (context.options[0] as ['object'] | undefined) ?? ['object'];

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
                    // TODO: autofix deep into arrays
                    .forEach(({ clsxCallNode, usageChunks }) => {
                        if (
                            mergedFor.includes('object') &&
                            usageChunks.some(
                                (chunk) => chunk[0]!.type === 'ObjectExpression' && chunk.length > 1
                            )
                        ) {
                            const args = usageChunks.map((chunk) => {
                                if (chunk[0]!.type === 'ObjectExpression') {
                                    const objectsArr = chunk as ObjectExpression[];
                                    const newObjectPropsText = objectsArr
                                        .flatMap((se) => se.properties)
                                        .map((prop) => sourceCode.getText(prop))
                                        .join(', ');

                                    return `{ ${newObjectPropsText} }`;
                                }

                                return chunk.map((el) => sourceCode.getText(el)).join(', ');
                            });

                            context.report({
                                messageId: 'object',
                                node: clsxCallNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        clsxCallNode,
                                        `${clsxCallNode.callee.name}(${args.join(', ')})`
                                    ),
                            });
                        }

                        // TODO: add support for arrays and strings
                    });
            },
        };
    },
};

export = rule;
