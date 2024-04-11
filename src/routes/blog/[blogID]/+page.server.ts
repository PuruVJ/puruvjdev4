import { blogMap } from '$lib/generated/blog';
import { fail, redirect } from '@sveltejs/kit';
import { parse } from 'node:path';

export const prerender = false;

let obj: Record<string, number> = {};

function getCacheFile() {
  const root = import.meta.env.DEV
    ? new URL(import.meta.url).pathname.split('/').slice(0, -2).join('/')
    : parse(import.meta.url).root;

  // get the file
  return Bun.file(root + '/likes.json');
}

export const load = async ({ params: { blogID } }) => {
  const data = blogMap[blogID];

  if (data.redirectTo) throw redirect(302, data.redirectTo);

  // get the file
  const cache_file = getCacheFile();

  console.log(cache_file);

  if (await cache_file.exists()) {
    obj = await cache_file.json();
  } else {
    await Bun.write(cache_file, JSON.stringify(obj, null, 2));
  }

  console.log(cache_file.name, obj);

  return { blogData: data, likes: obj[blogID] ?? 0 };
};

export const actions = {
  default: async ({ request, params }) => {
    const formdata = await request.formData();
    const operation = formdata.get('operation') as 'inc' | 'dec';

    const blogID = params.blogID;

    const likes = obj[blogID];

    if (!likes) {
      fail(404, { success: false, message: "blogID doesn't exists" });
    }

    const incrementVal = operation === 'inc' ? +1 : -1;
    const newLikes = likes + incrementVal;
    obj[blogID] = newLikes;

    // get the file
    const cache_file = getCacheFile();

    console.log({ obj });

    Bun.write(cache_file, JSON.stringify(obj, null, 2));

    return { likes: newLikes };
  },
};
