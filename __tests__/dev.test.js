const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
// const remark = require('remark');
// const visit = require('unist-util-visit');

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

// describe('remark', () => {
//   it('should just print text node', () => {
//     const content = fs.readFileSync(path.resolve(__dirname, './example.md'));
//     const tree = remark().parse(content);
//     const skipTypes = ['text'];

//     visit(
//       tree,
//       node => skipTypes.includes(node.type),
//       node => {} //console.log(node.value)
//     );
//   });
// });

describe('code block', () => {
  it('should strip all code blocks', () => {
    const content =
      'simple_text\n```js\nvar foo = "bar";\n```\nanother line\n other_text `inline-code`\nend_of_text';

    const codeCache = {};

    const stripCode = content.replace(
      /```[a-z]*\n[\s\S]*?\n```|`[^`\n]+`/g,
      (codeBlock, index) => {
        codeCache[index] = codeBlock;
        return '@'.repeat(codeBlock.length);
      }
    );

    const original = stripCode.replace(
      /@+/g,
      (cypher, index) =>
        codeCache[index] ? codeCache[index] : ' '.repeat(cypher.length)
    );
  });
});
