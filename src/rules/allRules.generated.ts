import forbidArrayExpressions from './forbid-array-expressions';
import forbidFalseInsideObjectExpressions from './forbid-false-inside-object-expressions';
import forbidTrueInsideObjectExpressions from './forbid-true-inside-object-expressions';
import noRedundantClsx from './no-redundant-clsx';
import noSpreading from './no-spreading';
import preferLogicalOverObjects from './prefer-logical-over-objects';
import preferMergedNeighboringElements from './prefer-merged-neighboring-elements';
import preferObjectsOverLogical from './prefer-objects-over-logical';

export const allRules = {
    'forbid-array-expressions': forbidArrayExpressions,
    'forbid-false-inside-object-expressions': forbidFalseInsideObjectExpressions,
    'forbid-true-inside-object-expressions': forbidTrueInsideObjectExpressions,
    'no-redundant-clsx': noRedundantClsx,
    'no-spreading': noSpreading,
    'prefer-logical-over-objects': preferLogicalOverObjects,
    'prefer-merged-neighboring-elements': preferMergedNeighboringElements,
    'prefer-objects-over-logical': preferObjectsOverLogical,
};
