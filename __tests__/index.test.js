const cheerio = require('cheerio');
const { mutateSource } = require('./../index');

describe('plugin', () => {
  const content = `---
        datetime: "2017-11-07 18:23:56"
        title: "Some code! #2"
        tags: ["hello", "cool", "sleepy"]
        published: true
        ---

        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta ea magnam quis quod voluptatem eos illo est odio maiores illum cumque dignissimos ullam sed, repellat quo sapiente repellendus eius sint.

        :laughing::cry:

        ## Cool section:sparkles:

        * item 1
        * item 2

        <!--read more-->

        Some secret message here
      `;

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
