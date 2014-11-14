var gulp   = require('gulp');
var config = require('../config').markup
var log    = require('../util/logging');
var es     = require('event-stream');


var $ = require('gulp-load-plugins')();

gulp.task('html', function() {
	var phpTemplatesOnly = '**/*.html.php';
	var jadeFilesOnly = '**/*.jade';
	var htmlFilesOnly = '**/*.html';
	var noPartials = function (file) {
		return !/\/_/.test(file.path) || !/^_/.test(file.relative);
	};

	var stream = gulp.src(config.src)
		.pipe($.plumber({errorHandler: log.onError}));

	//separate html-only files
	var htmlStream = stream.pipe($.filter(htmlFilesOnly))

		//log what's being worked on
		.pipe(log.working('<%= file.relative %>'));

	//process jade
	var jadeStream = stream.pipe($.filter(jadeFilesOnly))

		//only pass unchanged *main* file and *all* the partials
		.pipe($.changed(config.dest, {extension: '.html'}))

		//filter out unchanged partials, but it only works when watching
		.pipe($.if(global.isWatching, $.cached('html')))

		//find files that depend on the files that have changed
		.pipe($.jadeInheritance({basedir: 'app/htdocs'}))

		//filter out partials
		.pipe($.filter(noPartials))

		//log what's being worked on
		.pipe(log.working('<%= file.relative %>'))

		//add "relativeRoot" variable in Jade templates
		.pipe($.data(function (file) {
			var template = {
				relativePath: file.history[0].replace(file.base, '')
			};
			var depth = (template.relativePath.match(/\//g) || []).length;
			var relativeRoot = new Array(depth + 1).join( '../' );
			return {
				// template: template,
				relativeRoot: relativeRoot
			};
		}))

		//process jade templates
		.pipe($.jade());


	//process php templates
	//TODO: find depency tree like with jadeInheritance
	var phpStream = stream.pipe($.filter(phpTemplatesOnly))

		//filter out partials
		.pipe($.filter(noPartials))

		//log what's being worked on
		.pipe(log.working('<%= file.relative %>'))

		//parse php templates and output static html files
		.pipe($.php2html())

		//since php templates had a .html.php extension, now it's .html.html
		//so remove the second ".html"
		.pipe($.rename(function (file) {
			file.extname = '';
		}));


	//process all the html files, both static and generated ones
	stream = es.merge(jadeStream, phpStream, htmlStream)

		//compress html files, including inline CSS and JS
		.pipe($.compressor({
			type: 'html',
			// 'preserve-server-script': true,
			'compress-js': true,
			'compress-css': true,
			// 'preserve-comments': true
		}))

		//save all the files
		.pipe(gulp.dest(config.dest))

		//log all the output files
		.pipe(log.done('<%= file.relative %>'));


	//validate html files
	stream
		.pipe($.filter(htmlFilesOnly))
		.pipe($.w3cjs());//should be done asynchronously, so next tasks doesn't have to wait for it

	return stream;
});
