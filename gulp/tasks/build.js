'use strict';
var $       = require('gulp-load-plugins')();
var gulp    = require('gulp');
var compose = require('lodash-node/modern/function/compose');

var config     = require('../config');
var log        = require('../util/logging');
var noPartials = require('../util/no-partials');

function updateBuild () {

	var processes = [
		require('../workers/html-jade')({
			changedOnly: global.isWatching,
			dest: config.dest,
			data: {},
			basedir: './',
		}),
		require('../workers/html-compress')(),
		require('../workers/html-validate')(),

		require('../workers/svg-symbols')({
			dest: config.dest,
			destFolder: 'assets'
		}),

		require('../workers/img')({
			dest: config.dest
		}),

		require('../workers/css-scss')({
			includePaths: config.sass.includePaths,
			sourcemap: global.isWatching,
			dest: config.dest,
			changedOnly: global.isWatching
		}),
		require('../workers/css-postcss')(),
	];

	var processAll = compose.apply(null, processes.reverse());

	return processAll(gulp.src(config.src))
		//filter out partials
		.pipe($.filter(noPartials))

		// //filter out unchanged
		// .pipe($.changed(config.dest))

		//save all the files
		.pipe(gulp.dest(config.dest))

		//log all the output files
		.pipe(log.done('<%= file.relative %>'));
}
gulp.task('update-build', updateBuild);
module.exports = updateBuild;
