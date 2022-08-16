import type { IBlog } from '$lib/interfaces/blog.interface';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
  const res = await fetch('/data/blogs-list.json');
  const data = (await res.json()) as IBlog[];

  return { blogsList: data };
};

export const prerender = true;
