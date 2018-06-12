const emojione = require("emojione");
const twemoji = require("twemoji");

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

  return content.replace(/:(.*):/g, shortcut => {
    const toUnicode = emojione.shortnameToUnicode(shortcut);
    const toTwemoji = twemoji.parse(toUnicode);
    const styled = toTwemoji
      .split(/<img class="emoji"/g)
      .join(`<img class="emoji ${mergedOptions.classname}" style="${styles}"`);
    return styled;
  });
}

module.exports = {
  mutateSource: ({ markdownNode }, pluginOptions) => {
    const content = markdownNode.internal.content;
    const result = shortcutToTwemoji(content, pluginOptions);

    markdownNode.internal.content = result;
    return Promise.resolve(result);
  },
  shortcutToTwemoji
};
