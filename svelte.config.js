// @ts-check
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      crawl: true,
      enabled: true,
      entries: ['*'],
    },
  },
  //er

  preprocess: preprocess(),
};

export default config;
