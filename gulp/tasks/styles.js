'use strict';
var gulp         = require('gulp');
var log          = require('../util/logging');
var config       = require('../config').sass;

var $ = require('gulp-load-plugins')();

gulp.task('styles', ['images'], function () {
	return gulp.src(config.src)
		.pipe($.plumber({errorHandler: log.onError}))
		.pipe(log.working('<%= file.relative %>'))

		.pipe($.sass({
			outputStyle: 'expanded',
			sourcemap: global.isWatching,
			includePaths: config.includePaths
		}))
		.pipe($.cssimport())
		.pipe($.autoprefixer(['last 2 versions', 'ie 9']))
		.pipe($.if(!global.isWatching, $.csso(/*preventRestructuring*/true)))

		.pipe(gulp.dest(config.dest))
		.pipe(log.done('<%= file.relative %>'));
});