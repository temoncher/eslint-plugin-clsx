import type { ImportDeclaration, Node, SimpleCallExpression } from 'estree';
import type { Rule, SourceCode } from 'eslint';
import * as R from 'remeda';

type ClsxOptions = Record<string, string | string[]>;

export const chunkBy = <T>(collection: T[], chunker: (el: T) => unknown) => {
    const res = [] as T[][];

    const temp = [collection[0]] as T[];

    let lastChunkMarker = chunker(collection[0]!);

    // eslint-disable-next-line no-restricted-syntax
    for (const el of collection.slice(1)) {
        const currentChunkMarker = chunker(el);

        if (currentChunkMarker === lastChunkMarker) {
            temp.push(el);
            continue;
        }

        if (temp.length !== 0) {
            res.push([...temp]);
            temp.length = 0;
            temp.push(el);
        }

        lastChunkMarker = currentChunkMarker;
    }

    if (temp.length) res.push(temp);

    return res;
};

export const findClsxImport = (importNode: ImportDeclaration, clsxOptions: ClsxOptions) => {
    if (typeof importNode.source.value !== 'string') {
        throw new Error('import source value is not a string');
    }

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
        .filter(R.isDefined);
};

const isCallExpressionWithName =
    <N extends string>(name: N) =>
    (node: Node | undefined | null): node is SimpleCallExpression & { callee: { name: N } } =>
        !!node &&
        node.type === 'CallExpression' &&
        'name' in node.callee &&
        node.callee.name === name;

export const getClsxUsages = (
    importNode: ImportDeclaration,
    sourceCode: SourceCode,
    assignedClsxNames: string[]
) =>
    assignedClsxNames
        .flatMap((assignedClsxName) =>
            sourceCode.scopeManager
                .getDeclaredVariables(importNode)
                .find((variable) => variable.name === assignedClsxName)
                ?.references.map((ref) => (ref.identifier as unknown as { parent: Node }).parent)
                .filter(R.isDefined)
                .filter(isCallExpressionWithName(assignedClsxName))
        )
        .filter(R.isDefined);

export const extractClsxOptions = (context: Rule.RuleContext) =>
    (context.settings.clsxOptions ?? {
        clsx: ['default', 'clsx'],
        classnames: 'default',
    }) as ClsxOptions;
