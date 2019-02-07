const { shortcutToUnicode, replaceShortcut } = require('../src/helpers');

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
