import type { IBlog } from '$lib/interfaces/blog.interface';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {},
};

export const prerender = false;

export const load: PageServerLoad = async ({ params: { blogID }, fetch }) => {
  const res = await fetch(`/data/blog/${blogID}.json`);
  const data: IBlog = await res.json();

  if (data.redirectTo) throw redirect(302, data.redirectTo);

  return { blogData: data };
};
