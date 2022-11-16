import type { IBlog } from '$lib/interfaces/blog.interface';
import type { PageServerLoad } from './$types';

export const prerender = false;

const MAX_COUNT = 6;

export const load: PageServerLoad = async ({ fetch, platform }) => {
  const res = await fetch('/data/blogs-list.json');
  const data: IBlog[] = await res.json();

  const likesList: { id: string; likes: number; date: Date }[] = [];

  console.log(platform);
  for (const { id, date } of data) {
    const likes = +((await platform.env.LIKES.get(id)) ?? 0);
    likesList.push({ id, likes, date: new Date(date) });
  }

  const rankList = likesList.sort(
    (a, b) => calculateScore(b.likes, b.date + '') - calculateScore(a.likes, a.date + ''),
  );

  // Get data and write to file
  const rankedData = rankList
    .map(({ id }) => data.find((fmData) => fmData.id === id)!)
    .map(({ body, cover_image, ...data }) => data);

  rankedData.length = MAX_COUNT;

  return { blogsList: rankedData };
};

/**
 * Source: https://jkchu.com/2016/02/17/designing-and-implementing-a-ranking-algorithm/
 */
function calculateScore(likes: number, dateCreatedStr: string) {
  const timeCreatedDiff = (+new Date() - +new Date(dateCreatedStr)) / 1e6;

  const numerator = likes;

  const denominator = 1 + timeCreatedDiff ** 1.8;

  return (numerator / denominator) * 1e4;
}
