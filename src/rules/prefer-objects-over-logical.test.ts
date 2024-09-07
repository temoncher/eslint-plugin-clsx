import { RuleTester } from '@typescript-eslint/rule-tester';

import rule from './prefer-objects-over-logical';

new RuleTester().run('prefer-objects-over-logical', rule, {
    valid: [
        {
            code: `
import clsx from 'clsx';

const condition = true;
clsx({ 'flex-col': condition });
`,
        },
    ],
    invalid: [
        {
            code: `
import clsx from 'clsx';

const condition = true;
clsx(condition && 'flex-col');
`,
            errors: [
                {
                    messageId: 'default',
                    line: 5,
                    column: 1,
                },
            ],
            output: `
import clsx from 'clsx';

const condition = true;
clsx({ "flex-col": condition });
`,
        },
    ],
});
