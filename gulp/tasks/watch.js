'use strict';

/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp        = require('gulp');
var util        = require('gulp-util');
var config      = require('../config');
var browserSync = require('browser-sync');

gulp.task('setWatch', function() {
  global.isWatching = true;
  util.log(
  	util.colors.blue('ℹ︎'),
  	'HTML, SVG, and SCSS files will be rebuilt on change'
  );

  gulp.watch(config.sass.src,   gulp.parallel('css'));
  gulp.watch(config.images.src, gulp.parallel('images'));
  gulp.watch(config.svg.src,    gulp.parallel('svg'));
  gulp.watch(config.markup.src, gulp.parallel('html', browserSync.reload));

  config.copy.forEach(function (group) {
  	gulp.watch(group.src,       gulp.parallel('copy'));
  });
});
