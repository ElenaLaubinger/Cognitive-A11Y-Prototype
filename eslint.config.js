import js from '@eslint/js';
import svelteConfig from './svelte.config.js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
    { ignores: ['dist', 'out', 'coverage'] },
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            }
        }
    },
    {
        files: ['**/*.svelte', '**/*.svelte.js'],
        languageOptions: {
            parser: svelte.parser,
            parserOptions: {
                parser: ts.parser,
                svelteConfig
            }
        }
    },
    {
        rules: {
            'no-console': 'warn',
            'svelte/no-at-html-tags': 'off',
        }
    }
];