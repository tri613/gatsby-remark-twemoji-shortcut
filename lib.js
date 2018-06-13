const cheerio = require('cheerio');
const twemoji = require('twemoji');
// https://github.com/github/gemoji
const emojis = require('./emoji.json');

function shortcutToUnicode(shortcut) {
  const alias = shortcut.replace(/:/g, '');
  const result = emojis.find(emoji => emoji.aliases.includes(alias));
  return result ? result.emoji : null;
}

function replaceShortcut(content, replacement) {
  let result = content;
  content.replace(/(?=(:[\w\-+]+:))/g, (_, substr) => {
    result = result.replace(substr, replacement);
  });
  return result;
}

function parseTwemoji(content, classname, styles) {
  const twitterEmoji = twemoji.parse(content);
  const $ = cheerio.load(twitterEmoji, { xmlMode: true });

  const $emojis = $('img.emoji');
  $emojis.addClass(classname).css(styles);
  $emojis.each((i, el) => {
    const $emoji = $(el);
    const unicode = encodeURIComponent($emoji.attr('alt'));
    $emoji.attr('alt', unicode);
  });

  return $.html();
}

function shortcutToTwemoji(content, { classname = '', style = {} } = {}) {
  const defaultStyle = {
    height: `1em`,
    width: `1em`,
    margin: `0 .05em 0 .1em`,
    'vertical-align': `-0.1em`
  };
  const mergedStyle = Object.assign({}, defaultStyle, style);

  // replace shortcuts with unicode
  const replaced = replaceShortcut(content, shortcut => {
    const unicode = shortcutToUnicode(shortcut);
    return unicode ? unicode : shortcut;
  });

  const twittered = parseTwemoji(replaced, classname, mergedStyle);

  // decode alt's unicode
  const $ = cheerio.load(twittered, { xmlMode: true });
  $('img.emoji').each((i, el) => {
    const $emoji = $(el);
    const alt = decodeURIComponent($emoji.attr('alt'));
    $emoji.attr('alt', alt);
  });

  return $.html();
}

module.exports = {
  shortcutToTwemoji,
  replaceShortcut,
  shortcutToUnicode
};
