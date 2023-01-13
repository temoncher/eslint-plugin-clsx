// @ts-check
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const packageJson = require('../package.json');

const REPO_URL = packageJson.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');

const configFilters = {
    all: () => true,
    recommended: (rule) => rule.meta.docs.recommended,
};

const allRules = Object.fromEntries(
    fs
        .readdirSync(`${__dirname}/rules`)
        .map((fileName) => fileName.replace(/\.js$/, ''))
        // eslint-disable-next-line import/no-dynamic-require
        .map((ruleName) => [ruleName, require(path.join(__dirname, 'rules', ruleName))])
);

module.exports = {
    rules: utils.mapValues(allRules, (rule, ruleName) => ({
        ...rule,
        meta: {
            ...rule.meta,
            url: `${REPO_URL}/tree/HEAD/docs/rules/${ruleName}.md`,
        },
    })),
    configs: utils.mapValues(configFilters, (configPredicate) => ({
        plugins: ['clsx'],
        rules: Object.fromEntries(
            Object.entries(allRules)
                .filter(([_ruleName, rule]) => configPredicate(rule))
                .map(([ruleName]) => [`clsx/${ruleName}`, 1])
        ),
    })),
};
