const REPO_URL = require('./package.json')
    .repository.url.replace(/^git\+/, '')
    .replace(/\.git$/, '');

/** @type {import('eslint-doc-generator').GenerateOptions} */
module.exports = {
    ignoreConfig: ['all'],
    ruleDocSectionInclude: ['Rule Details'],
    urlConfigs: `${REPO_URL}#presets`,
};