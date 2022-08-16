import type { IWork } from '$lib/interfaces/work.interface';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`/data/works.json`);
  const data = (await res.json()) as IWork[];

  return { works: data };
};
