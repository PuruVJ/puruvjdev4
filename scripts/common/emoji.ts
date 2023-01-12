import twemoji from 'twemoji';

export function getEmoji(str: string) {
  return twemoji
    .parse(str, {
      ext: '.svg',
      folder: 'svg',
    })
    .replaceAll('twemoji.maxcdn.com/v', 'cdnjs.cloudflare.com/ajax/libs/twemoji');
}
