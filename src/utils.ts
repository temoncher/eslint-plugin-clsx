import { TSESTree } from '@typescript-eslint/types';
import type { RuleContext, SourceCode } from '@typescript-eslint/utils/ts-eslint';
import * as R from 'remeda';

type ClsxOptions = Record<string, string | string[]>;

export function chunkBy<T>(collection: T[], chunker: (el: T) => unknown) {
    const res = [] as T[][];
    const temp = [collection[0]] as T[];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let lastChunkMarker = chunker(collection[0]!);

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
}

export function findClsxImport(importNode: TSESTree.ImportDeclaration, clsxOptions: ClsxOptions) {
    if (typeof importNode.source.value !== 'string') {
        throw new Error('import source value is not a string');
    }

    const names = clsxOptions[importNode.source.value];
    const importNames = typeof names === 'string' ? [names] : names;

    return importNames
        ?.map((name) => {
            if (name === 'default') {
                const defaultSpecifier = importNode.specifiers.find(
                    (s) => s.type === TSESTree.AST_NODE_TYPES.ImportDefaultSpecifier
                );

                return defaultSpecifier?.local.name;
            }

            const named = importNode.specifiers.find(
                (s) =>
                    s.type === TSESTree.AST_NODE_TYPES.ImportSpecifier && s.imported.name === name
            );

            return named?.local.name;
        })
        .filter(R.isDefined);
}

function isCallExpressionWithName<N extends string>(name: N) {
    return (
        node: TSESTree.Node | undefined | null
    ): node is TSESTree.CallExpression & { callee: { name: N } } =>
        !!node &&
        node.type === TSESTree.AST_NODE_TYPES.CallExpression &&
        'name' in node.callee &&
        node.callee.name === name;
}

export function getClsxUsages(
    importNode: TSESTree.ImportDeclaration,
    sourceCode: SourceCode,
    assignedClsxNames: string[]
) {
    return assignedClsxNames
        .flatMap((assignedClsxName) =>
            sourceCode.scopeManager
                ?.getDeclaredVariables(importNode)
                .find((variable) => variable.name === assignedClsxName)
                ?.references.map(
                    (ref) => (ref.identifier as unknown as { parent: TSESTree.Node }).parent
                )
                .filter(R.isDefined)
                .filter(isCallExpressionWithName(assignedClsxName))
        )
        .filter(R.isDefined);
}

export function extractClsxOptions<M extends string, O extends readonly unknown[]>(
    context: RuleContext<M, O>
) {
    return (context.settings.clsxOptions ?? {
        clsx: ['default', 'clsx'],
        classnames: 'default',
    }) as ClsxOptions;
}
