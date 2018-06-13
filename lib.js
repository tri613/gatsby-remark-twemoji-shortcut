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

function parseTwemoji(content, classnames, styles) {
  const twitterEmoji = twemoji.parse(content);
  return twitterEmoji.replace(
    /<img class="emoji" draggable="false" alt="([^\s]*)" src="([a-zA-Z0-9@:%_\\+.~#?&/=]*)"\/>/g,
    (_, alt, src) =>
      `<img draggable="false" class="${classnames}" src="${src}" style="${styles}" alt="emoji"/>`
  );
}

function shortcutToTwemoji(content, options = {}) {
  const { classname = '', style = {} } = options;
  const mergedOptions = {
    classname,
    style: Object.assign(
      {},
      {
        height: `1em`,
        width: `1em`,
        margin: `0 .05em 0 .1em`,
        'vertical-align': `-0.1e`
      },
      style
    )
  };

  // prepare classnames and inline styles
  const classnames = [
    'emoji',
    ...mergedOptions.classname.split(' ').map(name => name.trim())
  ]
    .filter(name => !!name)
    .join(' ');

  const styles = Object.keys(mergedOptions.style)
    .map(key => `${key}: ${mergedOptions.style[key]}`)
    .join(';');

  // replace shortcuts with unicode
  const replaced = replaceShortcut(content, shortcut => {
    const unicode = shortcutToUnicode(shortcut);
    return unicode ? unicode : shortcut;
  });

  const twittered = parseTwemoji(replaced, classnames, styles);
  return twittered;
}

module.exports = {
  shortcutToTwemoji,
  replaceShortcut,
  shortcutToUnicode
};
