const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const { mutateSource, CodeBlockExtractor } = require('./../index');

const content = fs.readFileSync(path.resolve(__dirname, './example.md'), {
  encoding: 'utf8'
});

describe('plugin', () => {
  const getImgs = markdownNode => {
    const $ = cheerio.load(markdownNode.internal.content);
    return $.root().find('img.emoji');
  };

  let markdownNode;
  beforeEach(() => {
    markdownNode = {
      internal: {
        content
      }
    };
  });

  it('should work properly without options', () => {
    mutateSource({ markdownNode });

    const $imgs = getImgs(markdownNode);
    expect($imgs.length).toEqual(7);
    expect($imgs.attr('alt')).toEqual(expect.not.stringContaining('<img'));
    expect(markdownNode.internal.content).toEqual(
      expect.stringContaining(`:100:`)
    );
    expect(markdownNode.internal.content).toEqual(
      expect.stringContaining(`:1st_place_medal::+1:`)
    );
  });

  it('should work properly with options', () => {
    mutateSource(
      { markdownNode },
      {
        classname: 'test',
        style: {
          whatever: '123'
        }
      }
    );

    const $imgs = getImgs(markdownNode);
    expect($imgs.length).toEqual(7);
    expect($imgs.hasClass('test')).toBeTruthy();
    expect($imgs.css('whatever')).toBe('123');
  });

  it('should not break by processing multiple times', () => {
    mutateSource({ markdownNode });
    mutateSource({ markdownNode });

    const $imgs = getImgs(markdownNode);
    expect($imgs.length).toEqual(7);
    expect($imgs.attr('alt')).toEqual(expect.not.stringContaining('<img'));
  });
});

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
