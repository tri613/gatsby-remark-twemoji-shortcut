const {
  replaceShortcut,
  shortcutToUnicode,
  parseTwemoji
} = require('./helpers');

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

module.exports = shortcutToTwemoji;
