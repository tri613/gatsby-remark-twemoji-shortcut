const cheerio = require('cheerio');
const twemoji = require('twemoji');
// https://github.com/github/gemoji
const emojis = require('./emoji.json');

class CodeBlockExtractor {
  constructor() {
    this.cipher = '<!-- code block replacement -->';
    this.codeCache = [];
  }

  extract(content) {
    return content.replace(/```[a-z]*\n[\s\S]*?\n```|`[^`\n]+`/g, codeBlock => {
      this.codeCache.push(codeBlock);
      return this.cipher;
    });
  }

  putBack(extracted) {
    const regex = new RegExp(this.cipher, 'g');
    let i = 0;
    return extracted.replace(regex, ciphered => {
      const result = this.codeCache[i] ? this.codeCache[i] : ciphered;
      i++;
      return result;
    });
  }
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

  return parseTwemoji(replaced, classname, mergedStyle);
}

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
  CodeBlockExtractor,
  shortcutToTwemoji,
  replaceShortcut,
  shortcutToUnicode
};
