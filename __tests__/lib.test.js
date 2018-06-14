const cheerio = require('cheerio');
const {
  shortcutToUnicode,
  replaceShortcut,
  shortcutToTwemoji,
  CodeBlockExtractor
} = require('./../lib');

describe('shortcutToUnicode', () => {
  it('should return unicode instead of shortcuts', () => {
    expect(shortcutToUnicode(':smile:')).toBe('😄');
    expect(shortcutToUnicode(':+1:')).toBe('👍');
    expect(shortcutToUnicode(':sunglasses:')).toBe('😎');
    expect(shortcutToUnicode(':heart:')).toBe('❤️');
  });

  it('should return null if unicode not found', () => {
    expect(shortcutToUnicode(':whatever:')).toBeNull();
    expect(shortcutToUnicode(':123:')).toBeNull();
  });
});

describe('replaceShortcut', () => {
  const replaceWithUnicode = shortcut => {
    const unicode = shortcutToUnicode(shortcut);
    return unicode ? unicode : shortcut;
  };

  it('shoud replace all valid shortcuts to emojis', () => {
    const content = 'simple one :100::+1::-1::heart_eyes:';
    const result = replaceShortcut(content, replaceWithUnicode);
    expect(result).toBe('simple one 💯👍👎😍');
  });

  it('should work fine with invalid shortcuts', () => {
    const content = ':some content :123:34:45:cool::sunglasses:heart:';
    const result = replaceShortcut(content, replaceWithUnicode);
    expect(result).toBe(':some content :123:34:45🆒😎heart:');
  });
});

describe('shortcutToTwemoji', () => {
  it('should return emoji instead of shortcuts', () => {
    const content = `
      Hi! This is my first gatsby blog. Cool! :smile::+1::100:
      :cry::hand:
    `;
    const result = shortcutToTwemoji(content);

    const $ = cheerio.load(result);
    expect($.root().find('img').length).toEqual(5);
  });

  it('should not break with invalid shortcuts', () => {
    const content = '2034-12-23 12:34:sunglasses: :123sdfasdf::100::+1:';
    const result = shortcutToTwemoji(content);

    const $ = cheerio.load(result);
    expect($.root().find('img').length).toEqual(3);
  });

  it('shoud transfer normal emojis into twitter emojis', () => {
    const content = `:smile::+1::some_thing_else:100:👍:cry::hand:`;
    const result = shortcutToTwemoji(content);

    const $ = cheerio.load(result);
    expect($.root().find('img').length).toEqual(6);
    expect($.root().text()).toEqual(':some_thing_else');
  });

  it('should merge option styles', () => {
    const content =
      ':123123::heart::heart_eyes: should merge option styles :cool::100:';
    const color = `#BAD123`;
    const style = { 'background-color': color, height: `50px` };
    const result = shortcutToTwemoji(content, { style });

    const $ = cheerio.load(result);
    const $imgs = $.root().find('img');

    expect($imgs.length).toEqual(4);
    expect($imgs.css('background-color')).toEqual(color);
    expect($imgs.css('height')).toEqual('50px');
    expect($imgs.css('width')).toEqual('1em');
  });

  it('should not have an extra space if no additional classname', () => {
    const content = ':heart:';
    const result = shortcutToTwemoji(content);

    const $ = cheerio.load(result);
    const $img = $.root().find('img.emoji');
    expect($img.attr('class')).toBe('emoji');
  });

  it('should add option classname', () => {
    const content =
      ':123123::heart::heart_eyes: should add option classname :cool::100:';
    const result = shortcutToTwemoji(content, {
      classname: 'only-one-class-name'
    });

    const $ = cheerio.load(result);
    const $imgs = $.root().find('img.emoji');

    const classnames = [];
    $imgs.each(function(i, el) {
      classnames.push($(el).attr('class'));
    });

    expect(
      classnames.every(classname => classname.includes('only-one-class-name'))
    ).toBeTruthy();

    expect(
      classnames.every(classname => classname.includes('emoji'))
    ).toBeTruthy();
  });

  it('should add multiple option classnames', () => {
    const content = ':123123::heart::heart_eyes: just some text :cool::100:';
    const result = shortcutToTwemoji(content, {
      classname: 'my-class-name    another-class-name'
    });

    const $ = cheerio.load(result);
    const $imgs = $.root().find('img.emoji');

    const classnames = [];
    $imgs.each(function(i, el) {
      classnames.push($(el).attr('class'));
    });

    expect(
      classnames.every(classname => classname.includes('another-class-name'))
    ).toBeTruthy();
    expect(
      classnames.every(classname => classname.includes('my-class-name'))
    ).toBeTruthy();
    expect(
      classnames.every(classname => classname.includes('emoji'))
    ).toBeTruthy();
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
