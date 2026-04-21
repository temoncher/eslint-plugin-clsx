import type { RuleModule, ClassicConfig, SharedConfig } from '@typescript-eslint/utils/ts-eslint';
import type { Rule } from 'eslint';
import * as R from 'remeda';

import { PluginDocs } from './PluginDocs';
import { allRules, REPO_URL } from './rules/allRules.generated';

const configFilters = {
    all: () => true,
    recommended: (rule: RuleModule<string, unknown[], PluginDocs>) => rule.meta?.docs?.recommended,
} as const;

// TODO: remove remeda, unnecessary dependency
const rules = R.mapValues(allRules, (rule, ruleName) => ({
    ...rule,
    meta: {
        ...rule.meta,
        url: `${REPO_URL}/tree/HEAD/docs/rules/${ruleName}.md`,
    },
})) as {
    [K in keyof typeof allRules]: (typeof allRules)[K] & {
        meta: { url: `${typeof REPO_URL}/tree/HEAD/docs/rules/${K}.md` };
    } & Rule.RuleModule;
};

const configs = R.mapValues(configFilters, (configPredicate) => ({
    plugins: ['clsx'],
    rules: Object.fromEntries(
        Object.entries(allRules)
            .filter(([_ruleName, rule]) => configPredicate(rule))
            .map(([ruleName]) => [`clsx/${ruleName}`, 1])
    ) as SharedConfig.RulesRecord,
})) as Record<keyof typeof configFilters, ClassicConfig.Config>;

export = {
    rules,
    configs: {
        ...configs,
        flat: R.mapValues(configFilters, (configPredicate) => ({
            plugins: { clsx: { rules } },
            rules: Object.fromEntries(
                Object.entries(allRules)
                    .filter(([_ruleName, rule]) => configPredicate(rule))
                    .map(([ruleName]) => [`clsx/${ruleName}`, 1])
            ) as SharedConfig.RulesRecord,
        })),
    },
};
