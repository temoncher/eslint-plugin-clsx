import * as fs from 'fs';
import * as path from 'path';

import type { Rule } from 'eslint';
import * as R from 'remeda';

import packageJson from '../package.json';

const REPO_URL = packageJson.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');

const configFilters = {
    all: () => true,
    recommended: (rule: Rule.RuleModule) => rule.meta?.docs?.recommended,
};

const allRules = Object.fromEntries(
    fs
        .readdirSync(`${__dirname}/rules`)
        .map((fileName) => fileName.replace(/\.js$/, ''))

        .map((ruleName) => [
            ruleName,

            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require(path.join(__dirname, 'rules', ruleName)) as Rule.RuleModule,
        ])
);

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
