// @ts-check
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({ fallback: '/404.html' }),
  },

  preprocess: preprocess(),
};

export default config;
