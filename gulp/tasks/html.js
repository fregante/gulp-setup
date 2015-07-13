'use strict';
var gulp   = require('gulp');
var config = require('../config').markup;
var log    = require('../util/logging');
var es     = require('event-stream');
var path   = require('path');
var dirSeparator = path.sep.replace('\\', '\\\\');


var $ = require('gulp-load-plugins')();

gulp.task('html', function() {
	var jadeFilesOnly = '**/*.jade';
	var htmlFilesOnly = '**/*.html';
	var noPartials = function (file) {
		var relativePath = path.relative(file.base, file.path);
		return !new RegExp('(^|'+dirSeparator+')_').test(relativePath);
	};
	var jadeData;
	try {
		jadeData = require('../../app/html/site-data.js');
	} catch (e) {
		if (e && e.code !== 'MODULE_NOT_FOUND') {
			throw e;
		}
	}

	var stream = gulp.src(config.src)
		.pipe($.plumber({errorHandler: log.onError}));

	//separate html-only files
	var htmlStream = stream.pipe($.filter(htmlFilesOnly))

		//filter out partials
		.pipe($.filter(noPartials))

		//log what's being worked on
		.pipe(log.working('<%= file.relative %>'));

	//process jade
	var jadeStream = stream.pipe($.filter(jadeFilesOnly));

	if (global.isWatching) {
		jadeStream = jadeStream
			//only pass unchanged *main* file and *all* the partials
			.pipe($.changed(config.dest, {extension: '.html'}))

			//filter out unchanged partials
			.pipe($.cached('html'))

			//find files that depend on the files that have changed
			.pipe($.jadeInheritance({basedir: 'app/html'}));
	}

	jadeStream = jadeStream
		//filter out partials
		.pipe($.filter(noPartials))

		//log what's being worked on
		.pipe(log.working('<%= file.relative %>'))

		//add "relativeRoot" variable in Jade templates
		.pipe($.data(function (file) {
			var relativePath = path.relative(file.base, file.path);
			var depth = (relativePath.match(new RegExp(dirSeparator, 'g')) || []).length;
			var relativeRoot = new Array(depth + 1).join( '../' );
			return {
				relativeRoot: relativeRoot,
				inRoot: function (path) {
					if (!path) {
						return relativeRoot;
					}
					// remove preceding slash
					path = path.replace(/^\//, '');

					// add forward slash in directories
					if (!/[.]/.test(path.split('/').pop())) {
						path = path.replace(/([^/])$/,'$1/');
					}

					return relativeRoot + path;
				}
			};
		}))

		//add variables and functions from file
		.pipe($.data(function () {
			return jadeData;
		}))

		//process jade templates
		.pipe($.jade({basedir: './'}));


	//process all the html files, both static and generated ones
	stream = es.merge(jadeStream, htmlStream)

		//compress html files, including inline CSS and JS
		.pipe($.htmlmin({
			type: 'html',
			'removeComments': true,
			'collapseWhitespace': true,
			'conservativeCollapse': true,
			'collapseBooleanAttributes': true,
			'removeAttributeQuotes': true,
			'removeRedundantAttributes': true,
			'removeEmptyAttributes': true,
			'removeScriptTypeAttributes': true,
			'removeStyleLinkTypeAttributes': true,
			'minifyJS': true,
			'minifyCSS': true,
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
