import type { IWork } from '$lib/interfaces/work.interface';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch(`/data/works.json`);
  const data: IWork[] = await res.json();

  return { works: data };
};
