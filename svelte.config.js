// @ts-check
import preprocess from 'svelte-preprocess';
import adapter from 'svelte-adapter-bun';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({ precompress: false }),
  },

  preprocess: preprocess(),
};

export default config;
