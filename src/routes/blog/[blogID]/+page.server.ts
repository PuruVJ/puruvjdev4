import { fail, redirect } from '@sveltejs/kit';

import type { IBlog } from '$lib/interfaces/blog.interface';
import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

export const actions: Actions = {
  default: async ({ request, platform }) => {
    const formData = await request.formData();
    const blogID = formData.get('blogID') as string;
    const operation = formData.get('operation') as 'inc' | 'dec';

    const likesStr = await platform.env.LIKES.get(blogID);

    if (likesStr === null) {
      return fail(404, { success: false, message: "blogID doesn't exists" });
    }

    const incrementVal = operation === 'inc' ? +1 : -1;
    const newLikes = +likesStr + incrementVal;
    await platform.env.LIKES.put(blogID, `${newLikes}`);

    return { success: true, likes: newLikes };
  },
};

export const load: PageServerLoad = async ({ params: { blogID }, fetch, platform }) => {
  const res = await fetch(`/data/blog/${blogID}.json`);
  const data: IBlog = await res.json();

  if (data.redirectTo) throw redirect(302, data.redirectTo);

  const likesStr = await platform.env.LIKES?.get(blogID);

  if (likesStr === null) {
    // Create kv for this blogID
    await platform.env.LIKES.put(blogID, `0`);
  }

  const likes = +likesStr;

  return { blogData: data, likes };
};
