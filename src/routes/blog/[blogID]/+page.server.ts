import { blogMap } from '$lib/generated/blog';
import { Likes } from '$lib/server/likes.js';
import { fail, redirect } from '@sveltejs/kit';

export const prerender = false;

export const load = async ({ params: { blogID } }) => {
  const data = blogMap[blogID];

  if (data.redirectTo) throw redirect(302, data.redirectTo);

  return { blogData: data, likes: Likes.get(blogID) };
};

export const actions = {
  default: async ({ request, params }) => {
    const formdata = await request.formData();
    const operation = formdata.get('operation') as 'inc' | 'dec';

    const blogID = params.blogID;

    const likes = Likes.get(blogID);

    if (likes === undefined || likes === null) {
      fail(404, { success: false, message: "blogID doesn't exists" });
    }

    const incrementVal = operation === 'inc' ? +1 : -1;
    const newLikes = likes + incrementVal;
    Likes.set(blogID, newLikes);

    return { likes: newLikes };
  },
};
