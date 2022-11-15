import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
// @ts-check
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import sequence from 'svelte-sequential-preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],

  kit: {
    adapter: adapter({ fallback: '/404.html' }),
  },

  preprocess: sequence([preprocess(), mdsvex(mdsvexConfig)]),
};

export default config;
