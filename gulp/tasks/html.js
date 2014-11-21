'use strict';
var gulp   = require('gulp');
var config = require('../config').markup;
var log    = require('../util/logging');
var es     = require('event-stream');


var $ = require('gulp-load-plugins')();

gulp.task('html', function() {
	var phpTemplatesOnly = '**/*.html.php';
	var jadeFilesOnly = '**/*.jade';
	var htmlFilesOnly = '**/*.html';
	var noPartials = function (file) {
		var isWin = /^win/.test(process.platform);
		if (isWin) {
			return !/\\_/.test(file.path);
		}
		return !/\/_/.test(file.path);
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
			var isWin = /^win/.test(process.platform);
			var base;
			var relativePath;
			var filepath;
			/*
			file.base = 'app/docs'
			file.cwd = 'C:\path'
			file.history[0] = C:\\path\\app\\htdocs\\index.jade
			 */
			if(isWin) {
				filepath = file.history[0].replace(/\\+/g, '/');// C:\\file.jade -> C:/file.jade
				base = file.base.replace(/\\+/g, '/');// C:\path -> C:/path
				// base = cwd + '/' + file.base + '/';// -> C:/path/app/docs/
				relativePath = filepath.replace(base, '');// -> file.jade
			} else {
				if (file.base[0] === '/') {//absolute path
					base = file.base;
				} else {//relative path
					base = file.cwd + '/' + file.base + '/';
				}
				relativePath = file.history[0].replace(base, '');
			}
			var depth = (relativePath.match(/\//g) || []).length;

			return {
				relativeRoot: new Array(depth + 1).join( '../' )
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
