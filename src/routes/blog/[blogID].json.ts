import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ platform, params }) => {
  const { blogID = '' } = params;

  if (blogID === '') {
    return { status: 422, body: { message: "blogID can't be empty" } };
  }

  if (!platform || !('LIKES' in platform.env)) {
    return { status: 200, body: { likes: 0 } };
  }

  const likesStr = await platform.env.LIKES.get(blogID);

  if (likesStr === null) {
    // Create kv for this blogID
    await platform.env.LIKES.put(blogID, `0`);

    return { status: 200, body: { likes: 0 } };
  }

  const likes = +likesStr;

  if (isNaN(likes)) {
    return {
      status: 418,
      body: {
        message: 'likes are stored in a format which is non-convertible to number',
      },
    };
  }

  return { status: 200, body: { likes } };
};

export const post: RequestHandler = async ({ platform, params, request }) => {
  const { blogID = '' } = params;

  if (blogID === '') {
    return {
      status: 422,
      body: { message: "blogID can't be empty" },
    };
  }

  const { operation = '' } = await request.json<{ operation: 'inc' | 'dec' }>();

  if (!['inc', 'dec'].includes(operation)) {
    return {
      status: 422,
      body: { message: '`operation` should be either `inc` or `dec`' },
    };
  }

  if (!platform || !('LIKES' in platform.env)) {
    return { status: 200, body: { message: 'no-action-due-to-dev' } };
  }

  const likesStr = await platform.env.LIKES.get(blogID);

  if (likesStr === null) {
    return {
      status: 404,
      body: { message: "blogID doesn't exists" },
    };
  }

  const incrementVal = operation === 'inc' ? +1 : -1;
  await platform.env.LIKES.put(blogID, `${+likesStr + incrementVal}`);

  return { status: 200, body: { message: 'success' } };
};
