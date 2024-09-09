import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';
import * as R from 'remeda';

import { PluginDocs } from './PluginDocs';
import { allRules, REPO_URL } from './rules/allRules.generated';

const configFilters = {
    all: () => true,
    recommended: (rule: RuleModule<string, unknown[], PluginDocs>) => rule.meta?.docs?.recommended,
};

export = {
    rules: R.mapValues(allRules, (rule, ruleName) => ({
        ...rule,
        meta: {
            ...rule.meta,
            url: `${REPO_URL}/tree/HEAD/docs/rules/${ruleName}.md`,
        },
    })),
    configs: R.mapValues(configFilters, (configPredicate) => ({
        plugins: ['clsx'],
        rules: Object.fromEntries(
            Object.entries(allRules)
                .filter(([_ruleName, rule]) => configPredicate(rule))
                .map(([ruleName]) => [`clsx/${ruleName}`, 1])
        ),
    })),
};
