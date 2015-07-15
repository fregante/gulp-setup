'use strict';
var fs    = require('fs');
var log   = require('./util/logging');
var gulp  = require('gulp');

function done () {
	setTimeout(log._done, 100, {message:'gulp init done. Watching…'});
}

gulp.task('build', gulp.parallel('update-build', 'js'), done);
gulp.task('watch', gulp.series('setWatch', 'browserSync'), done);
gulp.task('nobs', gulp.series('browserSync-disable', 'watch'), done);

gulp.task('default', gulp.parallel('watch', 'build'));

