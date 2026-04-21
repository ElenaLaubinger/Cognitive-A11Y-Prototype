import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [
      svelte(),
      eslint({ cache: false }), // Add ESLint plugin with cache disabled for immediate feedback
    ],
  }
})