import type { IBlog } from '$lib/interfaces/blog.interface';
import { fail, redirect } from '@sveltejs/kit';
import { blogMap } from '$lib/generated/blog';
import { parse } from 'node:path';

export let prerender = false;

let obj: Record<string, number> = {};

function getCacheFile() {
  const root = import.meta.env.DEV
    ? new URL(import.meta.url).pathname.split('/').slice(0, -2).join('/')
    : parse(import.meta.url).root;

  // get the file
  return Bun.file(root + '/likes.json');
}

export const load = async ({ params: { blogID }, fetch, setHeaders }) => {
  const data = blogMap[blogID];

  if (data.redirectTo) throw redirect(302, data.redirectTo);

  // Cache for the CDN
  setHeaders({
    'Cache-Control': 's-maxage=1d, stale-while-revalidate',
  });

  // get the file
  const cache_file = getCacheFile();

  if (await cache_file.exists()) {
    obj = await cache_file.json();
  } else {
    await Bun.write(cache_file, JSON.stringify(obj));
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

    Bun.write(cache_file, JSON.stringify(obj));

    return { likes: newLikes };
  },
};
