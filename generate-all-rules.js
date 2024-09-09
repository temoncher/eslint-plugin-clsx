// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

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

const imports = ruleNames.map((name) => `import ${camelize(name)} from './${name}';`).join('\n');

const pairs = ruleNames.map((name) => `"${name}": ${camelize(name)}`).join(',\n');

const content = `${imports}\nexport const allRules = {\n${pairs}\n};\n`;

fs.writeFileSync(`${__dirname}/src/rules/allRules.generated.ts`, content);
