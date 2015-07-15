'use strict';
var $            = require('gulp-load-plugins')();
var es           = require('event-stream');
var path         = require('path');
var partialRight = require('lodash-node/modern/function/partialRight');

var log        = require('../util/logging');
var noPartials = require('../util/no-partials');

var jadeFilesOnly = '**/*.jade';

function process (stream, opts) {

	var current = stream;
	var others = stream.pipe($.ignore.exclude(jadeFilesOnly));

	if (opts.changedOnly) {
		current = current
		// @todo: use gulp-newer to see if ANY files need updating.
		// imperfect but better than a slow first build


		//only pass unchanged *main* file and *all* the partials
		.pipe($.changed(opts.dest, {extension: '.html'}))

		//filter out unchanged partials
		.pipe($.cached('html'))

		//find files that depend on the files that have changed
		.pipe($.jadeInheritance({basedir: 'app'}));
	}

	current = current
	// filter out non-jade files
	.pipe($.filter(jadeFilesOnly))

	//filter out partials
	.pipe($.filter(noPartials))

	//log what's being worked on
	.pipe(log.working('<%= file.relative %>'))

	//add "relativeRoot" variable in Jade templates
	.pipe($.data(function (file) {
		var dirSeparator = path.sep.replace('\\', '\\\\');
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
		return opts.data || {};
	}))

	//process jade templates
	.pipe($.jade({basedir: opts.basedir}));

	return es.merge(current, others).pipe($.dedupe());
}

module.exports = function getProcessor (opts) {
	return partialRight(process, opts);
};
