import type { Theme } from '$lib/stores/theme.store';

export async function handle({ event, resolve }) {
  return resolve(event, {
    transformPageChunk(input) {
      const theme = (event.cookies.get('theme') ?? '') as Theme;
      const html = input.html.replace('%sveltekit.theme%', theme);

      return html;
    },
  });
}
