'use strict';
var $            = require('gulp-load-plugins')();
var es           = require('event-stream');
var partialRight = require('lodash-node/modern/function/partialRight');

var log        = require('../util/logging');
var noPartials = require('../util/no-partials');

var scssOnly = '**/*.scss';

function process (stream, opts) {
	var current = stream.pipe($.ignore.include(scssOnly));
	var others = stream.pipe($.ignore.exclude(scssOnly));

	if (opts.changedOnly) {
		current = current
		// @todo: use gulp-newer to see if ANY files need updating.
		// imperfect but better than a slow first build


		//only pass unchanged *main* file and *all* the partials
		.pipe($.changed(opts.dest, {extension: '.css'}))

		//filter out unchanged partials
		.pipe($.cached('css'))

		//expand glob imports
		.pipe($.sassBulkImport())

		//find files that depend on the files that have changed
		.pipe($.sassInheritance({dir: 'app'}));
	}

	current = current

	//expand glob imports
	.pipe($.sassBulkImport()) // needs to be done after sassInheritance TOO

	//filter out partials
	.pipe($.filter(noPartials))

	//log what's being worked on
	.pipe(log.working('<%= file.relative %>'))

	//process sass files
	.pipe($.sass({
		outputStyle: 'expanded',
		sourcemap: opts.sourcemap,
		includePaths: opts.includePaths
	}));

	return es.merge(current, others);
}

module.exports = function getProcessor (opts) {
	return partialRight(process, opts);
};
