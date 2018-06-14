const { shortcutToTwemoji } = require('./lib');

class CodeBlockExtractor {
  constructor() {
    this.cipher = '<!-- code block replacement -->';
    this.codeCache = [];
  }

  extract(content) {
    return content.replace(
      /```[a-z]*\n[\s\S]*?\n```|`[^`\n]+`/g,
      (codeBlock, index) => {
        this.codeCache.push(codeBlock);
        return this.cipher;
      }
    );
  }

  putBack(extracted) {
    const regex = new RegExp(`${this.cipher}`, 'g');
    let i = 0;
    return extracted.replace(regex, (ciphered, index) => {
      const result = this.codeCache[i] ? this.codeCache[i] : ciphered;
      i++;
      return result;
    });
  }
}

function mutateSource({ markdownNode }, pluginOptions) {
  const content = markdownNode.internal.content;

  // for skipping code block and keeping underscore shortcuts (e.g. :1st_place_medal:)
  const extractor = new CodeBlockExtractor();
  const extracted = extractor.extract(content);
  const twittered = shortcutToTwemoji(extracted, pluginOptions);
  const result = extractor.putBack(twittered);

  markdownNode.internal.content = result;
  return Promise.resolve();
}

module.exports = { mutateSource, transform, CodeBlockExtractor };
