const cheerio = require("cheerio");
const { shortcutToTwemoji } = require("./index.js");

it("should return emoji instead of shortcuts", () => {
  const content = "Hi! This is my first gatsby blog. Cool! :smile: :+1: :100:";
  const result = shortcutToTwemoji(content);

  const $ = cheerio.load(result);
  expect($.root().find("img").length).toEqual(2);
});

it("should not break with invalid shortcuts", () => {
  const content = "2034-12-23 12:34:53 :sunglasses: :123sdfasdf:";
  const result = shortcutToTwemoji(content);

  const $ = cheerio.load(result);
  expect($.root().find("img").length).toEqual(1);
});

it("should merge option styles", () => {
  const content = ":123123::heart::heart_eyes:just some text:cool::100:";
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
  const content = ":123123::heart::heart_eyes:just some text:cool::100:";
  const style = {
    "background-color": `#BAD123`
  };
  const result = shortcutToTwemoji(content, {
    classname: "my-class-name another-class-name",
    style
  });

  const $ = cheerio.load(result);
  const $img = $.root().find("img");
  expect($img.hasClass("another-class-name")).toBeTruthy();
  expect($img.hasClass("my-class-name")).toBeTruthy();
  expect($img.hasClass("emoji")).toBeTruthy();

  expect($img.css("background-color")).toEqual("#BAD123");
});
