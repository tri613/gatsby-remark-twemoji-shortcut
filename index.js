const emojione = require('emojione');
const twemoji = require('twemoji');

function shortcutToTwemoji(content) {
  return content.replace(/:(\w*):/g, shortcut => {
    const toUnicode = emojione.shortnameToUnicode(shortcut);
    const toTwemoji = twemoji.parse(toUnicode);
    const styled = toTwemoji
      .split(/<img class="emoji"/g)
      .join(
        `<img class="emoji" style="height: 1em; width: 1em; margin: 0 .05em 0 .1em; vertical-align: -0.1em;"`
      );
    return styled;
  });
}

module.exports = {
  mutateSource: ({ markdownNode }, pluginOptions) => {
    const content = markdownNode.internal.content;
    const result = shortcutToTwemoji(content);

    markdownNode.internal.content = result;
    return Promise.resolve(result);
  },
  shortcutToTwemoji
};
