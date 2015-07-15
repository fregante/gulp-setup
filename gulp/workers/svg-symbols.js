'use strict';
var $            = require('gulp-load-plugins')();
var log          = require('../util/logging');
var gulp         = require('gulp');
var path         = require('path');
var partialRight = require('lodash-node/modern/function/partialRight');

var svgSymbolsOnly = '**/*.svg';

function process (stream, opts) {
	var destFolder = opts.destFolder || '';
	var dest = opts.dest || '';
	var name = path.basename(opts.name || 'symbols', '.svg');
	var current = stream.pipe($.ignore.include(svgSymbolsOnly));
	var others = stream.pipe($.ignore.exclude(svgSymbolsOnly));
	current = current
	.pipe($.newer(path.join(dest, destFolder, name+'.svg')))
	.pipe(log.working('<%= file.relative %>'))
	.pipe($.imagemin())
	.pipe($.rename({
		prefix: 'symbol-',
	}))
	.pipe($.svgstore({
		inlineSvg: true
	}))
	.pipe($.rename({
		dirname: destFolder,
		basename: name
	}))

	//save all the files
	.pipe(gulp.dest(dest))

	//log all the output files
	.pipe(log.done('<%= file.relative %>'));

	return others;
}

module.exports = function getImageProcessor (opts) {
	return partialRight(process, opts);
};
