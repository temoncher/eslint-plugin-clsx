import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/tests-setup.mjs'],
    bundle: false,
});
