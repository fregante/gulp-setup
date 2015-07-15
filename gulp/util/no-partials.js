'use strict';
var path         = require('path');
var dirSeparator = path.sep.replace('\\', '\\\\');
module.exports = function noPartials (file) {
	var relativePath = path.relative(process.cwd(), file.path);
	return !new RegExp('(^|'+dirSeparator+')_').test(relativePath);
};
