import { getEmoji } from 'scripts/common/emoji';

/**
 * Converts regular emojis to twitter emojis
 */
export function twemojiPlugin(document: Document) {
  document.documentElement.innerHTML = getEmoji(document.documentElement.innerHTML);

  return document;
}
