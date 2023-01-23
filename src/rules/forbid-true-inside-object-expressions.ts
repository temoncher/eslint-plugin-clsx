import type { Rule } from 'eslint';
import type { Property } from 'estree';
import * as R from 'remeda';
import * as utils from '../utils';

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'forbid usage of true literal inside object expressions of clsx',
            recommended: true,
        },
        fixable: 'code',
        schema: [{ enum: ['always', 'allowMixed'] }],
        messages: {
            default: 'Object expression inside clsx should not contain true literals',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const clsxOptions = utils.extractClsxOptions(context);
        const allowTrueLiterals =
            (context.options[0] as 'always' | 'allowMixed' | undefined) ?? 'allowMixed';

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

                        const [trueLiteralProps, otherProps] = R.partition(
                            argumentNode.properties,
                            (prop) =>
                                prop.type === 'Property' &&
                                prop.value.type === 'Literal' &&
                                prop.value.value === true
                        );

                        if (
                            trueLiteralProps.length !== 0 &&
                            (allowTrueLiterals === 'always' ||
                                (allowTrueLiterals === 'allowMixed' && otherProps.length === 0))
                        ) {
                            const trueLiteralPropsText = (trueLiteralProps as Property[])
                                .map((el) => {
                                    const keyText = sourceCode.getText(el.key);

                                    return el.computed ? keyText : `'${keyText}'`;
                                })
                                .join(', ');
                            const otherPropsText = otherProps
                                .map((prop) => sourceCode.getText(prop))
                                .join(', ');
                            const otherPropsWrappedInObject = otherPropsText
                                ? `{ ${otherPropsText} }`
                                : undefined;

                            context.report({
                                messageId: 'default',
                                node: argumentNode,
                                fix: (fixer) =>
                                    fixer.replaceText(
                                        argumentNode,
                                        [trueLiteralPropsText, otherPropsWrappedInObject]
                                            .filter(R.isDefined)
                                            .join(', ')
                                    ),
                            });
                        }
                    });
            },
        };
    },
};

export = rule;
