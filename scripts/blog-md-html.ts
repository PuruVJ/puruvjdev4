import { promises as fsp } from 'fs';
import { JSDOM } from 'jsdom';
import markdown from 'markdown-it';
import readingTime from 'reading-time';
import { getHighlighter, bundledLanguagesInfo } from 'shiki/bundle/full';
import { getBlogData } from './blog-data';
import {
  generateTOCPlugin,
  headingsWithAnchorsPlugin,
  imageOptimMarkupPlugin,
  linkNoOpenerPlugin,
  seriesLinksPlugin,
  twemojiPlugin,
} from './blog-plugins/index';
import { ASSETS_ROOT_PATH } from './constants';
import type { BlogData, UnwrapPromise } from './types';

export async function blogMDHtml({
  blogData,
  seriesList,
}: UnwrapPromise<ReturnType<typeof getBlogData>>) {
  const highlighter = await getHighlighter({
    themes: ['material-theme-palenight'],
    langs: [
      'typescript',
      'svelte',
      'js',
      'ts',
      'json',
      'md',
      'py',
      'go',
      'sh',
      'tsx',
      'jsx',
      'diff',
      'powershell',
    ],
  });

  const md = markdown({
    html: true,
    highlight: (str, lang, attrs) =>
      highlighter.codeToHtml(str, { lang, theme: 'material-theme-palenight' }),
  });

  console.log('<<<--------- Series found --------->>>');
  console.log(seriesList);
  console.log('\n');

  const data: Record<string, BlogData> = {};
  // Let's do it
  for (let {
    body,
    series,
    title,
    id,
    description,
    date,
    cover_image,
    seriesIndex,
    redirectTo,
    platform,
  } of blogData) {
    // Let's render it
    let html = md.render(body);

    // The dom representation
    let { document } = new JSDOM(html).window;

    document = linkNoOpenerPlugin(document);
    document = await imageOptimMarkupPlugin(document);
    document = headingsWithAnchorsPlugin(document);

    if (series) {
      /** @type {Array}*/
      let seriesPostsList = seriesList[series].sort((p1, p2) => +p1.date - +p2.date);

      document = seriesLinksPlugin(document, seriesPostsList, series, id);
    }

    const toc = generateTOCPlugin(document);

    // Finally
    html = document.body.innerHTML;

    // Calculate reading time
    const reading_time = readingTime(html, { wordsPerMinute: 400 }).minutes;

    data[id] = {
      cover_image,
      title,
      date,
      description,
      body: html,
      id,
      reading_time,
      toc,
      series,
      seriesIndex,
      redirectTo,
      platform,
    };

    console.log('\n');
  }

  try {
    await fsp.mkdir(new URL('../src/lib/generated', import.meta.url), { recursive: true });
  } catch {}

  fsp.writeFile(
    new URL('../src/lib/generated/blog-map.ts', import.meta.url),
    `// @ts-ignore\nexport const blogMap = ${JSON.stringify(
      data,
      null,
      2,
    )} as Record<string, import('../../../scripts/types').BlogData>;`,
  );
}
