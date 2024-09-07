/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: './src/rules/tests-setup.mjs',
    },
});
