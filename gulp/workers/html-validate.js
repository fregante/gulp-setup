'use strict';
var $ = require('gulp-load-plugins')();
var htmlFilesOnly = '**/*.html';

function process (stream) {
	//should be done asynchronously, so next tasks doesn't have to wait for it
	stream
		.pipe($.filter(htmlFilesOnly))
		.pipe($.w3cjs());

	return stream;
}

module.exports = function getProcessor () {
	return process;
};
