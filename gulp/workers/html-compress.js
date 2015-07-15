'use strict';
var $  = require('gulp-load-plugins')();
var es = require('event-stream');
var htmlFilesOnly = '**/*.html';

function process (stream) {
	//compress html files, including inline CSS and JS

	var current = stream.pipe($.ignore.include(htmlFilesOnly));
	var others = stream.pipe($.ignore.exclude(htmlFilesOnly));

	current = current
		.pipe($.htmlmin({
			type: 'html',
			removeComments: true,
			collapseWhitespace: true,
			conservativeCollapse: true,
			collapseBooleanAttributes: true,
			removeAttributeQuotes: true,
			removeRedundantAttributes: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			minifyJS: true,
			minifyCSS: true,
		}));

	return es.merge(current, others);
}

module.exports = function getProcessor () {
	return process;
};
