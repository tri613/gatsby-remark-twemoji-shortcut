const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const remark = require('remark');
const visit = require('unist-util-visit');

describe('cheerio', () => {
  it('should return string without wrapped html tags', () => {
    const $ = cheerio.load(`some text <img src="123" /> other text`, {
      xmlMode: true
    });
    $('img').attr('alt', 'cool');

    const result = $.html();
    expect(result).toBe('some text <img src="123" alt="cool"/> other text');
  });

  it('should encode and decode unicode emoji correctly', () => {
    const emoji = '👍';
    const encoded = encodeURIComponent(emoji);
    const decoded = decodeURIComponent(encoded);

    expect(decoded).toEqual(emoji);
  });
});

describe('remark visit', () => {
  const content = fs.readFileSync(path.resolve(__dirname, './example.md'));
  const tree = remark().parse(content);

  const skipTypes = ['code', 'inlineCode', 'html'];

  visit(
    tree,
    node => !skipTypes.includes(node.type),
    node => console.log(node.value)
  );
});
