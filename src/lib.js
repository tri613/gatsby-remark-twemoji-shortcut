const twemoji = require("twemoji");
// https://github.com/github/gemoji
const emojis = require("./emoji.json");

function replaceShortcut(content, replacement) {
  let result = content;
  content.replace(/(?=(:[\w\-\+]+:))/g, (_, substr) => {
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

  // prepare classnames and inline styles
  const classnames = [
    "emoji",
    ...mergedOptions.classname.split(" ").map(name => name.trim())
  ].filter(name => !!name);

  const styles = Object.keys(mergedOptions.style)
    .map(key => `${key}: ${mergedOptions.style[key]}`)
    .join(";");

  // replace shortcuts with unicode
  const replaced = replaceShortcut(content, shortcut => {
    const unicode = shortcutToUnicode(shortcut);
    return unicode ? unicode : shortcut;
  });

  const twitterEmoji = twemoji.parse(replaced);
  const styled = twitterEmoji
    .split(/<img class="emoji"/g)
    .join(`<img class="${classnames.join(" ")}" style="${styles}"`);

  return styled;
}

module.exports = {
  shortcutToTwemoji,
  shortcutToUnicode,
  replaceShortcut
};
