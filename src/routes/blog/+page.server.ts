import { blogList } from '$lib/generated/blog';

export const load = async () => {
  return { blogsList: blogList };
};
