const cheerio = require("cheerio");

const twemoji = require("twemoji");
const {
  shortcutToUnicode,
  shortcutToTwemoji,
  mutateSource
} = require("./index.js");

describe("shortcutToUnicode", () => {
  it("should return unicode instead of shortcuts", () => {
    expect(shortcutToUnicode(":smile:")).toBe("😄");
    expect(shortcutToUnicode(":+1:")).toBe("👍");
  });

  it("should return shortcuts if unicode not found", () => {
    expect(shortcutToUnicode(":whatever:")).toBe(":whatever:");
    expect(shortcutToUnicode(":sdfs::23434:")).toBe(":sdfs::23434:");
    expect(shortcutToUnicode(":cool::heart:")).toBe(":cool::heart:");
  });
});

describe("shortcutToTwemoji", () => {
  it("should return emoji instead of shortcuts", () => {
    const content =
      "Hi! This is my first gatsby blog. Cool! :smile: :+1: :100:";
    const result = shortcutToTwemoji(content);

    const $ = cheerio.load(result);
    expect($.root().find("img").length).toEqual(3);
  });

  it("should not break with invalid shortcuts", () => {
    const content = "2034-12-23 12:34:53 :sunglasses: :123sdfasdf:";
    const result = shortcutToTwemoji(content);

    const $ = cheerio.load(result);
    expect($.root().find("img").length).toEqual(1);
  });

  it("should merge option styles", () => {
    const content = ":123123: :heart: :heart_eyes: just some text :cool: :100:";
    const style = {
      "background-color": `#BAD123`
    };
    const result = shortcutToTwemoji(content, { style });

    const $ = cheerio.load(result);
    const $img = $.root().find("img");

    expect($img.css("background-color")).toEqual("#BAD123");
    expect($img.css("height")).toEqual("1em");
  });

  it("should add option's classname", () => {
    const content = ":123123: :heart: :heart_eyes: just some text :cool: :100:";
    const result = shortcutToTwemoji(content, {
      classname: "my-class-name another-class-name"
    });

    const $ = cheerio.load(result);
    const $img = $.root().find("img");
    expect($img.hasClass("another-class-name")).toBeTruthy();
    expect($img.hasClass("my-class-name")).toBeTruthy();
    expect($img.hasClass("emoji")).toBeTruthy();
  });
});

describe("Plugin", () => {
  const markdownNode = {
    internal: {
      content: `
        ---
        datetime: "2017-11-07 18:23:56"
        title: "Some code! #2"
        tags: ["hello", "cool", "sleepy"]
        published: true
        ---
  
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta ea magnam quis quod voluptatem eos illo est odio maiores illum cumque dignissimos ullam sed, repellat quo sapiente repellendus eius sint.
  
        ## Cool section
  
        * item 1
        * item 2
  
        <!--read more-->
  
        Some secret message here
      `
    }
  };

  it("should work properly without options", () => {
    return expect(mutateSource({ markdownNode })).resolves.toBeUndefined();
  });

  it("should work properly with options", () => {
    return expect(
      mutateSource(
        { markdownNode },
        {
          classname: "test",
          style: {
            whatever: "123"
          }
        }
      )
    ).resolves.toBeUndefined();
  });
});
