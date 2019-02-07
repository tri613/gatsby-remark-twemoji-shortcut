const CodeBlockExtractor = require('../src/codeBlockExtractor');

describe('CodeBlockExtractor', () => {
  it('should put back code correctly', () => {
    const original =
      'simple_text\n```js\nvar foo = "bar";\n```\nanother line\n other_text `inline-code`\nend_of_text';
    const extractor = new CodeBlockExtractor();
    const extracted = extractor.extract(original);

    const result = extractor.putBack(extracted);
    expect(result).toBe(original);
  });
});
