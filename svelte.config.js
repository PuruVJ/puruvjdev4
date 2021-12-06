// @ts-check
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    target: '#svelte',
    adapter: adapter({ fallback: '/404.html' }),
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
