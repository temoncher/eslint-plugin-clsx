/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const packageJson = require('./package.json');

function camelize(s) {
    return s.replace(/-./g, (x) => x[1].toUpperCase());
}

const ruleNames = fs
    .readdirSync(`${__dirname}/src/rules`)
    .filter(
        (fileName) =>
            !fileName.includes('.test') &&
            !fileName.includes('.generated') &&
            fileName !== 'tests-setup.mjs' &&
            fileName !== 'index.ts'
    )
    .map((fileName) => fileName.replace(/\.ts$/, ''));

const imports = ruleNames.map((name) => `import ${camelize(name)} from './${name}';`).join('');

const pairs = ruleNames.map((name) => `"${name}": ${camelize(name)}`).join(',');
const REPO_URL = packageJson.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');

const content = `${imports}\nexport const allRules = {${pairs}};\nexport const REPO_URL="${REPO_URL}"`;

fs.writeFileSync(`${__dirname}/src/rules/allRules.generated.ts`, content);
