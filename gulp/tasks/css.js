'use strict';
var gulp         = require('gulp');
var log          = require('../util/logging');
var config       = require('../config').sass;
var autoprefixer = require('autoprefixer-core');
var postcssImport= require('postcss-import');

var $ = require('gulp-load-plugins')();

gulp.task('css', ['images'], function () {
	var noPartials = function (file) {
		var isWin = /^win/.test(process.platform);
		if (isWin) {
			return !/\\_/.test(file.path);
		}
		return !/\/_/.test(file.path);
	};

	var processors = [
		autoprefixer({
			browsers: ['last 2 versions', 'ie 9']
		}),
		postcssImport()
	];

	return gulp.src(config.src)
		.pipe($.plumber({errorHandler: log.onError}))
		.pipe($.filter(noPartials))
		.pipe(log.working('<%= file.relative %>'))

		.pipe($.sassBulkImport())
		.pipe($.sass({
			outputStyle: 'expanded',
			sourcemap: global.isWatching,
			includePaths: config.includePaths
		}))
		.pipe($.postcss(processors))
		.pipe($.if(!global.isWatching, $.csso(/*preventRestructuring*/true)))

		.pipe(gulp.dest(config.dest))
		.pipe(log.done('<%= file.relative %>'));
});
