// @ts-check
import preprocess from 'svelte-preprocess';
import cfAdapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    target: '#svelte',
    adapter: cfAdapter({ treeShaking: true, minify: true }),
    prerender: {
      crawl: true,
      enabled: true,
      entries: ['*'],
    },
  },

  preprocess: preprocess(),
};

export default config;
