import type { IBlog } from '$lib/interfaces/blog.interface';

export const load = async ({ fetch }) => {
  const res = await fetch('/data/homepage-blogs-list.json');
  const data = (await res.json()) as IBlog[];

  return { blogsList: data };
};
