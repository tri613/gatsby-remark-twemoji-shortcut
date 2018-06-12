const { shortcutToTwemoji } = require('./index.js');

it('should return emoji from twitter', () => {
  const content = '\n\nHi! This is my first gatsby blog. Cool! :smile:';

  const result = shortcutToTwemoji(content);
  console.log(result);

  expect(result).toEqual(expect.not.stringMatching(/:(\w*):/));
});
