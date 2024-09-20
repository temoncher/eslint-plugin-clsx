import { RuleTester } from '@typescript-eslint/rule-tester';

import rule from './no-redundant-clsx';

new RuleTester().run('no-redundant-clsx', rule, {
    valid: [
        {
            name: 'Default selector. Two classes with Literals',
            code: `
import clsx from 'clsx';

const classes = clsx('flex', 'flex-col');
`,
        },
        {
            name: 'Default selector. Object literal',
            code: `
import clsx from 'clsx';

const condition = true;
const classes = clsx({ 'flex': condition });
`,
        },
        {
            name: 'Default selector. Array literal',
            code: `
import clsx from 'clsx';

const condition = true;
const classes = clsx(['flex']);
`,
        },
        {
            name: 'Only Literal selector. Template literal',
            options: [{ selector: 'Literal' }],
            code: `
import clsx from 'clsx';

const col = 'col';
const classes = clsx(\`flex-\${col}\`);
`,
        },
    ],
    invalid: [
        {
            name: 'Default selector. One class with Literal',
            code: `
import clsx from 'clsx';

const classes = clsx('flex');
`,
            errors: [
                {
                    messageId: 'default',
                    line: 4,
                    column: 17,
                },
            ],
            output: `
import clsx from 'clsx';

const classes = 'flex';
`,
        },
        {
            name: 'Default selector. One class with TemplateLiteral',
            code: `
import clsx from 'clsx';

const col = 'col';
const classes = clsx(\`flex-\${col}\`);
`,
            errors: [
                {
                    messageId: 'default',
                    line: 5,
                    column: 17,
                },
            ],
            output: `
import clsx from 'clsx';

const col = 'col';
const classes = \`flex-\${col}\`;
`,
        },
        {
            name: 'Custom selector for css modules. One class with `styles.prop` property access',
            options: [
                {
                    selector:
                        ':matches(Literal, TemplateLiteral, MemberExpression[object.name="styles"])',
                },
            ],
            code: `
import clsx from 'clsx';
import styles from './some-css-file.css';

const classes = clsx(styles.myStyle);
`,
            errors: [
                {
                    messageId: 'default',
                    line: 5,
                    column: 17,
                },
            ],
            output: `
import clsx from 'clsx';
import styles from './some-css-file.css';

const classes = styles.myStyle;
`,
        },
    ],
});
