const cheerio = require("cheerio");
const {
  shortcutToUnicode,
  shortcutToTwemoji,
  replaceShortcut
} = require("./../lib");

const replaceWithUnicode = shortcut => {
  const unicode = shortcutToUnicode(shortcut);
  return unicode ? unicode : shortcut;
};

describe("replaceShortcut", () => {
  it("shoud replace all valid shortcuts to emojis", () => {
    const content = "simple one :100::+1::-1::heart_eyes:";
    const result = replaceShortcut(content, replaceWithUnicode);
    expect(result).toBe("simple one 💯👍👎😍");
  });

  it("should work fine with invalid shortcuts", () => {
    const content = ":some content :123:34:45::cool::sunglasses:";
    const result = replaceShortcut(content, replaceWithUnicode);
    expect(result).toBe(":some content :123:34:45:🆒😎");
  });
});

describe("shortcutToUnicode", () => {
  it("should return unicode instead of shortcuts", () => {
    expect(shortcutToUnicode(":smile:")).toBe("😄");
    expect(shortcutToUnicode(":+1:")).toBe("👍");
    expect(shortcutToUnicode(":sunglasses:")).toBe("😎");
    expect(shortcutToUnicode(":heart:")).toBe("❤️");
  });

  it("should return null if unicode not found", () => {
    expect(shortcutToUnicode(":whatever:")).toBeNull();
    expect(shortcutToUnicode(":123:")).toBeNull();
  });
});

describe("shortcutToTwemoji", () => {
  it("should return emoji instead of shortcuts", () => {
    const content = `
      Hi! This is my first gatsby blog. Cool! :smile::+1::100:
      :cry::hand:
    `;
    const result = shortcutToTwemoji(content);

    const $ = cheerio.load(result);
    expect($.root().find("img").length).toEqual(5);
  });

  it("should not break with invalid shortcuts", () => {
    const content = "2034-12-23 12:34:sunglasses: :123sdfasdf::100::+1:";
    const result = shortcutToTwemoji(content);

    const $ = cheerio.load(result);
    expect($.root().find("img").length).toEqual(3);
  });

  it("should merge option styles", () => {
    const content = ":123123::heart::heart_eyes: just some text :cool::100:";
    const color = `#BAD123`;
    const style = { "background-color": color };
    const result = shortcutToTwemoji(content, { style });

    const $ = cheerio.load(result);
    const $img = $.root().find("img");

    expect($img.length).toEqual(4);
    expect($img.css("background-color")).toEqual(color);
    expect($img.css("height")).toEqual("1em");
  });

  it("should add option classname", () => {
    const content = ":123123::heart::heart_eyes: just some text :cool::100:";
    const result = shortcutToTwemoji(content, {
      classname: "my-class-name another-class-name"
    });

    const $ = cheerio.load(result);
    const $imgs = $.root().find("img.emoji");

    const classnames = [];
    $imgs.each(function(i, el) {
      classnames.push($(el).attr("class"));
    });

    expect(
      classnames.every(classname => classname.includes("another-class-name"))
    ).toBeTruthy();
    expect(
      classnames.every(classname => classname.includes("my-class-name"))
    ).toBeTruthy();
    expect(
      classnames.every(classname => classname.includes("emoji"))
    ).toBeTruthy();
  });
});
