import type { IWork } from '$lib/interfaces/work.interface';

export const load = async ({ fetch }) => {
  const res = await fetch(`/data/works.json`);
  const data = (await res.json()) as IWork[];

  return { works: data };
};
