// @ts-check
module.exports.findClsxImport = (importNode, clsxOptions) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [libPath, importName] of Object.entries(clsxOptions)) {
        const libMatches = importNode.source.value === libPath;

        if (!libMatches) {
            continue;
        }

        if (importName === 'default') {
            const defaultSpecifier = importNode.specifiers.find(
                (s) => s.type === 'ImportDefaultSpecifier'
            );

            if (defaultSpecifier) {
                return defaultSpecifier.local.name;
            }

            continue;
        }

        const named = importNode.specifiers.find(
            (s) => s.type === 'ImportSpecifier' && s.imported.name === importName
        );

        if (named) {
            return named.local.name;
        }
    }

    return undefined;
};

const isCallExpressionWithName = (name) => (node) =>
    node && node.type === 'CallExpression' && node.callee.name === name;

module.exports.getClsxUsages = (importNode, sourceCode, assignedClsxName) =>
    sourceCode.scopeManager
        .getDeclaredVariables(importNode)
        .find((variable) => variable.name === assignedClsxName)
        ?.references.map((ref) => ref.identifier.parent)
        .filter(isCallExpressionWithName(assignedClsxName));

module.exports.mapValues = (obj, map) =>
    Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, map(value, key)]));
