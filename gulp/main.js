'use strict';
var gulp = require('gulp');
var log  = require('../util/logging');
function done () {
	setTimeout(log._done, 100, {message:'gulp init done. Watching…'});
}

gulp.task('build', ['js', 'css', 'images', 'svg', 'html', 'copy']);
gulp.task('watch', ['setWatch', 'js', 'browserSync']);

gulp.task('default', ['watch'], done);
gulp.task('nobs', ['browserSync-disable', 'watch'], done);
