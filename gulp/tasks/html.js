var gulp   = require('gulp');
var config = require('../config').markup
var log    = require('../util/logging');

var $ = require('gulp-load-plugins')();

gulp.task('html', function() {
	var phpTemplatesFilter = $.filter('*.html.php');
  return gulp.src(config.src)
		.pipe($.plumber({errorHandler: log.onError}))

		.pipe(phpTemplatesFilter)
		.pipe($.php2html())
		.pipe(phpTemplatesFilter.restore())

		.pipe($.changed(config.dest)) // Ignore unchanged files
		.pipe(log.working('<%= file.relative %>'))

		.pipe($.compressor({
			type: 'html',
			// 'preserve-server-script': true,
			'compress-js': true,
			'compress-css': true,
			// 'preserve-comments': true
		}))

    .pipe(gulp.dest(config.dest))
		.pipe(log.done('<%= file.relative %>'));
});
