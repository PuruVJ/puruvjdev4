import { promises as fsp } from 'fs';
import { cloudinary } from './cloudinary.js';
import { ASSETS_ROOT_PATH, RELATIVE_ASSETS_PATH } from './constants';
import { optimizeGif } from './gif-module';
import { gifMarkup, imageMarkup } from './markup';
import { ExportedImagesMetaData } from './types';

/**
 * Optimize the image and create its different versions
 * Assuming the image is media folder in assets
 */
export async function optimizeBlogImages(src: string, altText: string, returnMarkup = true) {
  // Start measuring
  console.log('Starting to retrieve/create image/data');

  // First off, don't optimize this image and save us some CPU time if it already exists
  // First get the filename
  const [filePath, baseFolder] = src.split('/').reverse();
  const [fileName] = filePath.split('.');

  const [format] = filePath.split('.').reverse();

  /*
   * The vars are of this pattern:
   * /{baseFolder}/{fileName}.{format}
   */

  const folderPath = `${ASSETS_ROOT_PATH}/${baseFolder}/${fileName}`;

  const getOrgPath = (size: 'large' | 'small') =>
    `${RELATIVE_ASSETS_PATH}/${baseFolder}/${fileName}/${size}.webp`;

  /**
   * The list of file paths to return
   */
  const list: ExportedImagesMetaData = {
    large: {
      org: getOrgPath('large'),
    },
    small: {
      org: getOrgPath('small'),
    },
    aspectHTW: 1,
    format: format as 'jpg' | 'png',
  };

  let shouldOptimize = true;

  // Check if this folder exists
  try {
    await fsp.access(folderPath);
    shouldOptimize = false;

    if ((await fsp.readdir(folderPath)).includes('data.json') && format !== 'gif') {
      // The data file exists. Get the aspect ratio from there
      const { aspectHTW } = JSON.parse(await fsp.readFile(`${folderPath}/data.json`, 'utf-8'));

      list.aspectHTW = aspectHTW;
    }
  } catch {}

  // The markup

  // Should not optimize, if not gif
  if (!shouldOptimize && format !== 'gif') {
    // Log the time
    console.log(`Finished.`);
    console.log();
    return returnMarkup ? imageMarkup(list, format, altText) : list;
  }

  // Optimize if GIF
  if (format === 'gif') {
    // Do the gif-specific optimizations and return early
    console.log('GIF detected!');

    if (shouldOptimize) await optimizeGif(fileName);

    return gifMarkup(fileName);
  }

  // The image is optimizable. That means work, boys!
  // Let's try make the folder
  try {
    await fsp.mkdir(`${ASSETS_ROOT_PATH}/${baseFolder}/${fileName}`);
  } catch (e) {}

  const upload = (width: number) =>
    cloudinary.uploader.upload(`${folderPath}.${format}`, {
      format,
      folder: 'media',
      transformation: [
        {
          quality: 80,
          width,
          crop: 'scale',
          format: 'webp',
        },
      ],
      use_filename: true,
      overwrite: true,
    });

  const fetchImg = (path: string) =>
    fetch(path)
      .then((res) => res.blob())
      .then(async (blob) => Buffer.from(await blob.arrayBuffer()));

  const [bigOriginal, smallOriginal] = await Promise.all([upload(1200), upload(600)]);
  console.log('APIRESP', [bigOriginal, smallOriginal]);
  const [bigOriginalBuffer, smallOriginalBuffer] = await Promise.all([
    fetchImg(bigOriginal.url),
    fetchImg(smallOriginal.url),
  ]);

  // get aspect ratio
  list.aspectHTW = bigOriginal.height / bigOriginal.width;

  // Write inside the folder
  fsp.writeFile(`${folderPath}/large.webp`, bigOriginalBuffer);
  fsp.writeFile(`${folderPath}/small.webp`, smallOriginalBuffer);

  // Also write the data.json
  fsp.writeFile(
    `${folderPath}/data.json`,
    JSON.stringify({
      aspectHTW: list.aspectHTW,
    }),
  );

  // Log the time
  console.log(`Finished`);
  console.log();

  // Return the list
  return returnMarkup ? imageMarkup(list, format, altText) : list;
}

//   optimizeBlogImages('../../static/media/deep-dive-preact-source--wait-what.gif', false);
