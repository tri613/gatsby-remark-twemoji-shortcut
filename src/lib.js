const twemoji = require("twemoji");
// https://github.com/github/gemoji
const emojis = require("./emoji.json");

function replaceShortcut(content, replacement) {
  let result = content;
  content.replace(/(?=(:[a-z0-9\-\+_]+:))/g, (_, substr) => {
    result = result.replace(substr, replacement);
  });
  return result;
}

function shortcutToUnicode(shortcut) {
  const alias = shortcut.replace(/:/g, "");
  const result = emojis.find(emoji => emoji.aliases.includes(alias));
  return result ? result.emoji : null;
}

function shortcutToTwemoji(content, options = {}) {
  const { classname = "", style = {} } = options;
  const mergedOptions = {
    classname,
    style: Object.assign(
      {},
      {
        height: `1em`,
        width: `1em`,
        margin: `0 .05em 0 .1em`,
        "vertical-align": `-0.1e`
      },
      style
    )
  };

  const styles = Object.keys(mergedOptions.style)
    .map(key => `${key}: ${mergedOptions.style[key]}`)
    .join(";");

  const result = replaceShortcut(content, shortcut => {
    const unicode = shortcutToUnicode(shortcut);

    if (!unicode) {
      return shortcut;
    }

    const twitterEmoji = twemoji.parse(unicode);
    const styled = twitterEmoji
      .split(/<img class="emoji"/g)
      .join(`<img class="emoji ${mergedOptions.classname}" style="${styles}"`);

    return styled;
  });

  return result;
}

module.exports = {
  shortcutToTwemoji,
  shortcutToUnicode,
  replaceShortcut
};
