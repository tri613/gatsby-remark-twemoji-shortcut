# gatsby-remark-twemoji-shortcut

A [gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark) plugin to add twitter emoji with shortcuts! :sparkles:

## Install

### Install package

```
yarn add gatsby-remark-twemoji-shortcut
```

or 

```
npm install gatsby-remark-twemoji-shortcut
```

### Add to your `gatsby-config.js`

```javascript
// gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-prismjs`, // some other remark plugins
          {
            resolve: `gatsby-remark-twemoji-shortcut`,
            options: {
              classname: 'some_classname another_classname', // add additional classname(s) to the emoji
              style: { 
                // add additional inline-styling to the emoji
                background: 'gold'
              }
            }
          }
        ]
      }
    },
    // ...other plugins
  ]
};
```

- The default classname is `emoji` (from twemoji) and will not be removed when additional classname is set.

- The default inline styles are as [twemoji suggested](https://github.com/twitter/twemoji#inline-styles):

```css
img.emoji {
   height: 1em;
   width: 1em;
   margin: 0 .05em 0 .1em;
   vertical-align: -0.1em;
}
```

The styles will be merged with default and additional (option) styles.
If you pass in a css property which exists in the default, the default style would be overwritten by the additional style.

## Usage
Just write emoji shortcuts in your markdown and it will be transformed into twitter emojis!

A markdown post like this:

```
---
datetime: "2018-06-13 15:33:38"
title: "Twitter Emojis!"
tags: ["emoji", "twitter", "plugin"]
---

Add twitter emojis with no sweat. :sunglasses::heart::tada::sparkles:
```

Get turns into this:

![](https://i.imgur.com/QBnHp2s.png)

That's it! :tada:

:point_right: This plugin also converts plain emojis (unicode) into twitter emojis!

## Changelog

### v0.10.0 release - 2018/06/18

:warning: This is currently the most stable version and I strongly recommend user using v0.9.x upgrade to this version.

- Add feature to skip shortcuts and plain emojis from inline codes or code blocks.

## Special Thanks

- The shortcut emoji mapping is pulled from [gemoji](https://github.com/github/gemoji), huge thanks for this awesome list.
- This repo is inspired by other great gatsby remark emoji plugins!
  - https://github.com/matchilling/gatsby-remark-emojis
  - https://github.com/Rulikkk/gatsby-remark-emoji
