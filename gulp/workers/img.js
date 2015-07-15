'use strict';
var $            = require('gulp-load-plugins')();
var es           = require('event-stream');
var partialRight = require('lodash-node/modern/function/partialRight');

var log          = require('../util/logging');
var noPartials = require('../util/no-partials');
var imagesOnly = '**/*.{svg,png,jpeg,jpg,gif}';

function process (stream, opts) {
	var current = stream.pipe($.ignore.include(imagesOnly));
	var others = stream.pipe($.ignore.exclude(imagesOnly));

	current = current
	.pipe($.filter(noPartials))
	// .pipe($.changed(opts.dest)) // Ignore unchanged files
	.pipe(log.working('<%= file.relative %>'));

	var staticImages = current.pipe($.filter(['**','!animatable-svg/**']))
	.pipe($.imagemin({
		optimizationLevel: 3,
		progressive: true,
	}));

	//preserve some SVG features that allow javascript editing
	var animatable = current.pipe($.filter('animatable-svg/**'))
	.pipe($.imagemin({
		svgoPlugins: [{
			cleanupIDs: false,
		}],
	}));

	return es.merge(staticImages, animatable, others);
}

module.exports = function getProcessor (opts) {
	return partialRight(process, opts);
};

/**
 * SHUT UP, GULPIMAGEMIN
 */
var gutil = require('gulp-util');
gutil._log = gutil.log;
gutil.log = function () {
	if(arguments[0] === 'gulp-imagemin:') {
		return;
	}
	gutil._log.apply(gutil, arguments);
};
