const twemoji = require("twemoji");
// https://github.com/github/gemoji
const emojis = require("./emoji.json");

function shortcutToUnicode(shortcut) {
  const result = emojis.find(emoji =>
    emoji.aliases.includes(shortcut.replace(/:/g, ""))
  );

  return result ? result.emoji : shortcut;
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

  const result = content.replace(/:(\S*):/g, shortcut => {
    const toUnicode = shortcutToUnicode(shortcut);
    const toTwemoji = twemoji.parse(toUnicode);

    const styled = toTwemoji
      .split(/<img class="emoji"/g)
      .join(`<img class="emoji ${mergedOptions.classname}" style="${styles}"`);

    return styled;
  });

  return result;
}

module.exports = {
  mutateSource: ({ markdownNode }, pluginOptions) => {
    const content = markdownNode.internal.content;
    const result = shortcutToTwemoji(content, pluginOptions);

    markdownNode.internal.content = result;
    return Promise.resolve();
  },
  shortcutToTwemoji,
  shortcutToUnicode
};
