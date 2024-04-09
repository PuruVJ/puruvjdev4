import { promises as fsp } from 'fs';
import { ASSETS_ROOT_PATH } from './constants';
import type { BlogData } from './types';

export async function generateBlogsList({ blogData }: { blogData: BlogData[] }) {
  console.log('--------- Generating blogs list -----------');

  const finalData = blogData.map(({ body, cover_image, ...data }) => data);

  try {
    await fsp.mkdir(new URL('../src/lib/generated', import.meta.url));
  } catch {}

  // Write data
  fsp.writeFile(
    new URL('../src/lib/generated/blog-list.ts', import.meta.url),
    `export const blogList = ${JSON.stringify(finalData)}`,
  );

  fsp.writeFile(
    new URL('../src/lib/generated/blog.ts', import.meta.url),
    `export { blogMap } from './blog-map'\nexport { blogList } from './blog-list'`,
  );

  console.log('---------- Generated ------------');
}
