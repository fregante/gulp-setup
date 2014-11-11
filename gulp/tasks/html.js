var gulp   = require('gulp');
var config = require('../config').markup
var log    = require('../util/logging');

var $ = require('gulp-load-plugins')();

gulp.task('html', function() {
	var phpTemplatesFilter = $.filter('**/*.html.php');
	var jadeFilter = $.filter('**/*.jade');
	var noPartialsFilter = $.filter(function (file) {
		return !/\/_/.test(file.path) || !/^_/.test(file.relative);
	});
	var stream = gulp.src(config.src)
		.pipe($.plumber({errorHandler: log.onError}))

		.pipe(noPartialsFilter)//don't process partials

		//process php templates
		.pipe(phpTemplatesFilter)
		.pipe($.php2html())
		.pipe($.rename(function (path) {
			path.extname = ""
		}))
		.pipe(phpTemplatesFilter.restore())

		.pipe($.changed(config.dest)) // Ignore unchanged files
		.pipe(log.working('<%= file.relative %>'))

		//process jade
		.pipe(jadeFilter)
		.pipe($.jade())
		.pipe(jadeFilter.restore())


		.pipe($.compressor({
			type: 'html',
			// 'preserve-server-script': true,
			'compress-js': true,
			'compress-css': true,
			// 'preserve-comments': true
		}))

		.pipe(gulp.dest(config.dest))
		.pipe(log.done('<%= file.relative %>'));


	stream
		.pipe($.filter('**/*.html'))
		.pipe($.w3cjs());//should be done asynchronously, so livereload doesn't have to wait for it

	return stream;
});
