// @ts-check
import { defineMDSveXConfig } from 'mdsvex';

const config = defineMDSveXConfig({
  extensions: ['.svelte.md', '.md', '.svx'],

  layout: {
    blog: './src/routes/blog/blog-layout.svelte',
  },

  smartypants: {
    dashes: 'oldschool',
  },

  remarkPlugins: [],
  rehypePlugins: [],
});

export default config;
