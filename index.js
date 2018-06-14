const { shortcutToTwemoji } = require('./lib');

module.exports = {
  mutateSource: ({ markdownNode }, pluginOptions) => {
    const content = markdownNode.internal.content;
    const result = shortcutToTwemoji(content, pluginOptions);

    markdownNode.internal.content = result;
    return Promise.resolve();
  }
};
