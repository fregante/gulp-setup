# Install & first run

```sh
npm install -g gulp
npm install
gulp build
```

Bower not needed. Use `npm install some-package` when necessary or drop the vendor's  JS files in `js/_modules`.

# Launch server with auto-build and auto-reload

```sh
gulp
```

# Project info

## Javascript

To build the js files, [Browserify](http://browserify.org/) and [Babel](https://babeljs.io) are used. 

> Browsers don't have the require method defined, but Node.js does. With Browserify you can write code that uses require in the same way that you would use it in Node.


> Babel will turn your ES6+ code into ES5 friendly code, so you can start using it right now without waiting for browser support. [Learn more](https://babeljs.io/docs/learn-es6/)

## CSS

CSS is built via Sass and then [PostCSS.](https://github.com/postcss/postcss) 

> PostCSS is a tool for transforming CSS with JS plugins.

PostCSS is currently set up to automatically add prefixes with [autoprefixer](https://github.com/postcss/autoprefixer) (i.e. NO NEED TO ADD PREFIXES MANUALLY!) and to `@import` css files with [postcss-import](https://github.com/postcss/postcss-import)

## Images

Images and SVGs in `app/images` are automatically compressed as necessary. SVGs will be compressed with [SVGO](https://github.com/svg/svgo) and that might remove necessary attributes — it won't be a problem unless you want to animate the SVG's paths.

## Other assets

Place whatever else you need inside `/assets` AND add another `copy` entry to `/gulp/config.js`
