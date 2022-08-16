import type { IBlog } from '$lib/interfaces/blog.interface';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/data/homepage-blogs-list.json');
  const data = (await res.json()) as IBlog[];

  return { blogsList: data };
};
