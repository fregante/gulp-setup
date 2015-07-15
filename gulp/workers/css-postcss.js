'use strict';
var $            = require('gulp-load-plugins')();
var es           = require('event-stream');
var partialRight = require('lodash-node/modern/function/partialRight');
var autoprefixer = require('autoprefixer-core');
var postcss      = require('gulp-load-plugins')({
	pattern: 'postcss-*',
	replaceString: /^postcss-/
});

var noPartials = require('../util/no-partials');

var cssOnly = '**/*.css';


var processors = [
	// advanced
	postcss.assets(),

	// properties
	postcss.position(),
	// postcss.short(),
	postcss.colorPalette(),
	postcss.willChange(),
	// postcss.propertyLookup(),
	postcss.easings(),

	// selectors
	postcss.pseudoClassAnyLink(),
	postcss.selectorNot(),

	// queries
	// postcss.mediaMinmax(),
	postcss.import(),

	autoprefixer({
		browsers: ['last 2 versions', 'ie 9']
	}),

	postcss.logWarnings(),
];

function process (stream) {
	var current = stream.pipe($.ignore.include(cssOnly));
	var others = stream.pipe($.ignore.exclude(cssOnly));

	current = current
	.pipe($.filter(noPartials))
	.pipe($.postcss(processors));

	return es.merge(current, others);
}

module.exports = function getProcessor (opts) {
	return partialRight(process, opts);
};
