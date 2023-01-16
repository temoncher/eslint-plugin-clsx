import type { Rule } from 'eslint';
import * as utils from '../utils';

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of false literal inside object expressions of clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
        messages: {
            falseLiterals: 'Object expression inside clsx should not contain false literals',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
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
                        if (argumentNode.type !== 'ObjectExpression') return;

                        const propsWithoutFalseLiterals = argumentNode.properties.filter(
                            (prop) =>
                                !(
                                    prop.type === 'Property' &&
                                    prop.value.type === 'Literal' &&
                                    prop.value.value === false
                                )
                        );

                        if (propsWithoutFalseLiterals.length !== argumentNode.properties.length) {
                            const propsText = propsWithoutFalseLiterals
                                .map((prop) => sourceCode.getText(prop))
                                .join(', ');

                            context.report({
                                messageId: 'trueLiterals',
                                node: argumentNode,
                                fix: (fixer) => fixer.replaceText(argumentNode, `{ ${propsText} }`),
                            });
                        }
                    });
            },
        };
    },
};

export = rule;
