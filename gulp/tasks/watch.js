'use strict';

/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var bs     = require('browser-sync').create();
var log    = require('../util/logging');
var gulp   = require('gulp');
var config = require('../config');
var update = require('./build');
// var browserSync = require('browser-sync');

gulp.task('setWatch', function(done) {
  global.isWatching = true;
  log._info({
  	message: 'HTML, SVG, and SCSS files will be rebuilt on change'
  });
  bs.watch(config.src)
  .on('change', update)
  .on('add', update);
  // gulp.watch(config.markup.src, gulp.parallel('html', browserSync.reload));
  done()
});
