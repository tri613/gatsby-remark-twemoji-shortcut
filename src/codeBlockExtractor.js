class CodeBlockExtractor {
  constructor() {
    this.cipher = '<!-- code block replacement -->';
    this.codeCache = [];
  }

  extract(content) {
    return content.replace(/```[a-z]*\n[\s\S]*?\n```|`[^`\n]+`/g, codeBlock => {
      this.codeCache.push(codeBlock);
      return this.cipher;
    });
  }

  putBack(extracted) {
    const regex = new RegExp(this.cipher, 'g');
    let i = 0;
    return extracted.replace(regex, ciphered => {
      const result = this.codeCache[i] ? this.codeCache[i] : ciphered;
      i++;
      return result;
    });
  }
}

module.exports = CodeBlockExtractor;
