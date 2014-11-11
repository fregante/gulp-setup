var gulp   = require('gulp');
var config = require('../config').images;
var log    = require('../util/logging');

var $ = require('gulp-load-plugins')();

gulp.task('images', function() {
  return gulp.src(config.src)
		.pipe($.plumber({errorHandler: log.onError}))
    .pipe($.changed(config.dest)) // Ignore unchanged files
		.pipe(log.working('<%= file.relative %>'))

    .pipe($.imagemin({
			optimizationLevel: 3,
			progressive: true
		}))

    .pipe(gulp.dest(config.dest))
		.pipe(log.done('<%= file.relative %>'));
});
