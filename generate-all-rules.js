// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

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

const imports = ruleNames.map((name, i) => `import r${i} from './${name}';`).join('\n');

const pairs = ruleNames.map((name, i) => `"${name}": r${i}`).join(',\n');

const content = `${imports}\nexport const allRules = {\n${pairs}\n};\n`;

fs.writeFileSync(`${__dirname}/src/rules/allRules.generated.ts`, content);
