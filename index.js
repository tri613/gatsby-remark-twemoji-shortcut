const { CodeBlockExtractor, shortcutToTwemoji } = require('./lib');

function mutateSource({ markdownNode }, pluginOptions) {
  const content = markdownNode.internal.content;

  // for skipping code blocks and keeping underscore shortcuts (e.g. :1st_place_medal:)
  const extractor = new CodeBlockExtractor();
  const extracted = extractor.extract(content);
  const twittered = shortcutToTwemoji(extracted, pluginOptions);
  const result = extractor.putBack(twittered);

  markdownNode.internal.content = result;
  return Promise.resolve();
}

module.exports = { mutateSource };
