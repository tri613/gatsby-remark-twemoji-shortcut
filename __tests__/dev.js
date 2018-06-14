const cheerio = require('cheerio');

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
