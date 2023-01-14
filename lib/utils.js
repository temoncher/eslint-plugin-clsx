// @ts-check

/** @typedef {Record<string, string | string[]>} ClsxOptions */

/** @type {<T>(el: T | undefined) => el is T} */
const isDefined = (el) => el !== undefined;

/**
 * @param {import('estree').ImportDeclaration} importNode
 * @param {ClsxOptions} clsxOptions
 */
module.exports.findClsxImport = (importNode, clsxOptions) => {
    /** @type {string | string[] | undefined} */
    const names = clsxOptions[importNode.source.value];
    const importNames = typeof names === 'string' ? [names] : names;

    return importNames
        ?.map((name) => {
            if (name === 'default') {
                const defaultSpecifier = importNode.specifiers.find(
                    (s) => s.type === 'ImportDefaultSpecifier'
                );

                return defaultSpecifier?.local.name;
            }

            const named = importNode.specifiers.find(
                (s) => s.type === 'ImportSpecifier' && s.imported.name === name
            );

            return named?.local.name;
        })
        .filter(isDefined);
};

/** @type {(name: string) => (node: import('estree').Node | undefined) => node is import('estree').CallExpression} */
const isCallExpressionWithName = (name) => (node) =>
    node && node.type === 'CallExpression' && node.callee.name === name;

/**
 * @param {import('estree').ImportDeclaration} importNode
 * @param {import('eslint').SourceCode} sourceCode
 * @param {string[]} assignedClsxNames
 */
module.exports.getClsxUsages = (importNode, sourceCode, assignedClsxNames) =>
    assignedClsxNames
        .flatMap((assignedClsxName) =>
            sourceCode.scopeManager
                .getDeclaredVariables(importNode)
                .find((variable) => variable.name === assignedClsxName)
                ?.references.map(
                    (ref) => /** @type {import('estree').Node} */ (ref.identifier.parent)
                )
                .filter(isCallExpressionWithName(assignedClsxName))
        )
        .filter(isDefined);

module.exports.mapValues = (obj, map) =>
    Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, map(value, key)]));

/** @returns {ClsxOptions} */
module.exports.extractClsxOptions = (context) =>
    context.settings.clsxOptions ?? { clsx: 'default', classnames: 'default' };
