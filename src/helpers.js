const cheerio = require('cheerio');
const twemoji = require('twemoji');
// https://github.com/github/gemoji
const emojis = require('./emoji.json');

function replaceShortcut(content, replacement) {
  let result = content;
  content.replace(/(?=(:[\w\-+]+:))/g, (_, substr) => {
    result = result.replace(substr, replacement);
  });
  return result;
}

function shortcutToUnicode(shortcut) {
  const alias = shortcut.replace(/:/g, '');
  const result = emojis.find(emoji => emoji.aliases.includes(alias));
  return result ? result.emoji : null;
}

function parseTwemoji(content, classname, styles) {
  const twitterEmoji = twemoji.parse(content);
  const $ = cheerio.load(twitterEmoji, { xmlMode: true });

  const $emojis = $('img.emoji');
  $emojis.addClass(classname).css(styles);

  return $.html();
}

module.exports = {
  replaceShortcut,
  shortcutToUnicode,
  parseTwemoji
};
