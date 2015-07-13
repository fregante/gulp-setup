'use strict';
var gulp         = require('gulp');
var log          = require('../util/logging');
var config       = require('../config').sass;
var autoprefixer = require('autoprefixer-core');
var loadPlugins  = require('gulp-load-plugins');
var plugin       = loadPlugins();
var postcss      = loadPlugins({pattern: 'postcss-*', replaceString: /^postcss-/});
var path         = require('path');

gulp.task('css', function () {
	var noPartials = function (file) {
		var isWin = /^win/.test(process.platform);
		var cwd = process.cwd();
		var relatvePath = path.relative(cwd,file.path);
		if (isWin) {
			return !/\\_/.test(relatvePath);
		}
		return !/\/_/.test(relatvePath);
	};

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

	return gulp.src(config.src)
		.pipe(plugin.plumber({errorHandler: log.onError}))
		.pipe(plugin.filter(noPartials))
		.pipe(log.working('<%= file.relative %>'))

		.pipe(plugin.sassBulkImport())
		.pipe(plugin.sass({
			outputStyle: 'expanded',
			sourcemap: global.isWatching,
			includePaths: config.includePaths
		}))
		.pipe(plugin.postcss(processors))
		// .pipe(plugin.if(!global.isWatching, plugin.csso(/*preventRestructuring*/true)))

		.pipe(gulp.dest(config.dest))
		.pipe(log.done('<%= file.relative %>'));
});
