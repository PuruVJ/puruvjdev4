import { promises as fsp } from 'fs';
import { ASSETS_ROOT_PATH } from './constants';
import { BlogData } from './types';
import { Database } from 'bun:sqlite';

let db: Database;

try {
  db = new Database('/likes.sqlite');
} catch (e) {
  db = new Database('likes.sqlite');
}

const MAX_COUNT = 6;

export async function getPopularBlogPosts({ blogData }: { blogData: BlogData[] }) {
  // List
  const likesList: { id: string; likes: number; date: Date }[] = [];

  for (const { id, date } of blogData) {
    const { likes = 0 } = (db.query('SELECT likes FROM likes WHERE blogID = ?').get(id) || {}) as {
      likes: number;
    };

    likesList.push({ id, likes, date });
  }

  const rankList = likesList.sort(
    (a, b) => calculateScore(b.likes, b.date + '') - calculateScore(a.likes, a.date + ''),
  );

  // Get data and write to file
  const rankedData = rankList
    .map(({ id }) => blogData.find((fmData) => fmData.id === id)!)
    .map(({ body, cover_image, ...data }) => data);

  rankedData.length = MAX_COUNT;

  // Write to the file
  fsp.writeFile(`${ASSETS_ROOT_PATH}/data/homepage-blogs-list.json`, JSON.stringify(rankedData));
}

/**
 * Source: https://jkchu.com/2016/02/17/designing-and-implementing-a-ranking-algorithm/

 */
function calculateScore(likes: number, dateCreatedStr: string) {
  const timeCreatedDiff = (+new Date() - +new Date(dateCreatedStr)) / 1e6;

  const numerator = likes;

  const denominator = 1 + timeCreatedDiff ** 1.8;

  return (numerator / denominator) * 1e4;
}
