import type { IBlog } from '$lib/interfaces/blog.interface';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ params: { blogID }, fetch }) => {
  const res = await fetch(`/data/blog/${blogID}.json`);
  const data: IBlog = await res.json();

  if (data.redirectTo) throw redirect(302, data.redirectTo);

  return { blogData: data };
};
