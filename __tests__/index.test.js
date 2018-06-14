const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { mutateSource } = require('./../index');

describe('plugin', () => {
  const content = fs.readFileSync(path.resolve(__dirname, './example.md'), {
    encoding: 'utf8'
  });

  it('should work properly without options', () => {
    const markdownNode = {
      internal: {
        content
      }
    };
    mutateSource({ markdownNode });
    const $ = cheerio.load(markdownNode.internal.content);
    const $imgs = $.root().find('img.emoji');
    expect($imgs.length).toEqual(3);
    expect($imgs.attr('alt')).toEqual(expect.not.stringContaining('<img'));
  });

  it('should work properly with options', () => {
    const markdownNode = {
      internal: {
        content
      }
    };

    mutateSource(
      { markdownNode },
      {
        classname: 'test',
        style: {
          whatever: '123'
        }
      }
    );

    const $ = cheerio.load(markdownNode.internal.content);
    const $imgs = $.root().find('img.emoji');
    expect($imgs.length).toEqual(3);
    expect($imgs.hasClass('test')).toBeTruthy();
    expect($imgs.css('whatever')).toBe('123');
  });

  it('should not break by processing multiple times', () => {
    const markdownNode = {
      internal: {
        content
      }
    };
    mutateSource({ markdownNode });
    mutateSource({ markdownNode });
    const $ = cheerio.load(markdownNode.internal.content);
    const $imgs = $.root().find('img.emoji');
    expect($imgs.length).toEqual(3);
    expect($imgs.attr('alt')).toEqual(expect.not.stringContaining('<img'));
  });
});
