# gatsby-remark-twemoji-shortcut

A [gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark) plugin to add twitter emoji with shortcuts! :sparkles:

## Install

### Install package

This package is not on npm yet, so either you can add it as a submodule, or use `git+https` to add it to your npm package.

#### Submodule with local plugins

- Head over to your gatsby project root, add a folder called `plugins`.
- Go into the `plugins` directory.
- Add this plugin as a submodule.

```bash
$ git submodule add https://github.com/tri613/gatsby-remark-twemoji-shortcut.git
```
- Eventually, your project would look like this:
```
project
└─── plugins
│    └───gatsby-remark-twemoji-shortcut
└─── src
└─── ...other stuffs
```

You can read more about local plugins on [Gatsby.js](https://www.gatsbyjs.org/docs/plugin-authoring/#local-plugins).

#### Install with yarn / npm

```
$ yarn add git+https://github.com/tri613/gatsby-remark-twemoji-shortcut.git
// or
$ npm install git+https://github.com/tri613/gatsby-remark-twemoji-shortcut.git

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
              classname: 'some_classname another_classname', // add additional classname to the emoji
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

## Usage
Just write shortcuts in your markdown and it will be transformed into twitter emojis!

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

## Special Thanks

- The shortcut emoji mapping is pulled from [gemoji](https://github.com/github/gemoji), huge thanks for this awesome list.

- This repo is inspired by another great gatsby remark emoji plugin: https://github.com/matchilling/gatsby-remark-emojis.