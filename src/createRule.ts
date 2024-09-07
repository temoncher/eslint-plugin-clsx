import { ESLintUtils } from '@typescript-eslint/utils';

export const createRule = ESLintUtils.RuleCreator<{ recommended?: boolean }>(
    (name) => `https://github.com/temoncher/eslint-plugin-clsx/blob/main/docs/rules/${name}.md`
);
