
'use strict';
var gulp = require('gulp');
var log  = require('./util/logging');
function done () {
	setTimeout(log._done, 100, {message:'gulp init done. Watching…'});
}

gulp.task('build', gulp.parallel('js', 'css', 'svg', 'html', 'copy'));
gulp.task('watch', gulp.parallel('setWatch', 'js', 'browserSync'));

gulp.task('default', gulp.parallel('watch'), done);
gulp.task('nobs', gulp.parallel('browserSync-disable', 'watch'), done);
