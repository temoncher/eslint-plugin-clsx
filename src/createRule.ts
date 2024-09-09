import { ESLintUtils } from '@typescript-eslint/utils';

import type { PluginDocs } from './PluginDocs';

export const createRule = ESLintUtils.RuleCreator<PluginDocs>(
    (name) => `https://github.com/temoncher/eslint-plugin-clsx/blob/main/docs/rules/${name}.md`
);
