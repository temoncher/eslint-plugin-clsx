import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/**/*.ts', '!src/**/*.test.ts', '!src/rules/tests-setup.mjs'],
    splitting: false,
    sourcemap: false,
    clean: true,
});
