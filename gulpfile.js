'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// var _ = require('lodash');
// var es = require('event-stream');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

var log = require('./gulpfile.logging.js');

var bowerPath = 'app/bower_components';

var PATHS = {};
PATHS.dest = 'dist';
PATHS.assetsDest = PATHS.dest+'/assets';
PATHS.imagesSrc = [
	'app/assets/images/*',
];

var browserifyOpts = {
	insertGlobals: true,
	basedir: './',
	debug: true,
	// Note: At this time it seems that you will also have to
	// setup browserify-shims in package.json to correctly handle
	// the exclusion of vendor libraries from your bundle
	external: ['lodash'],
	extensions: ['.js']
};




// Styles
function buildStyle () {
	return gulp.src('app/scss/bfred.scss')
		.pipe(log.working('<%= file.relative %>'))
		.pipe($.plumber({errorHandler: log.onError}))
		.pipe($.sass({
			outputStyle: 'expanded',
			includePaths: [bowerPath]
		}))
		.pipe($.cssimport())
		.pipe($.autoprefixer('last 1 version', 'ff 24', 'ie 9'))
		// .pipe($.csso())
		.pipe(gulp.dest(PATHS.assetsDest))
		.pipe(log.done('<%= file.relative %>'));
}

// Scripts
function buildScript (bundler, uglify) {
	// require('fs').writeFile('dist/update-time.txt', new Date());
	return bundler.bundle()
		// .pipe($.plumber({errorHandler: log.onError}))
    .pipe(source('bfred.js'))
		.pipe(log.done('<%= file.relative %>'))
		.pipe($.if(uglify, $.buffer()))
		.pipe($.if(uglify, $.uglify()))
    .pipe(gulp.dest(PATHS.assetsDest));
}
function buildAndWatchScripts (lr) {
	var bundler;
	if (lr) {
		bundler = watchify(browserifyOpts);
	} else {
		bundler = browserify(browserifyOpts);
	}
	bundler.add('./app/scripts/bfred.js');
	bundler.transform('debowerify');
	bundler.transform('deglobalify');
	if (lr) {
		bundler.on('update', function () { buildScript(bundler).pipe(lr()); });
		return buildScript(bundler);
	}
	return buildScript(bundler, true);
}

// HTML
function buildHTML() {
	var indexOnly = $.filter('index.php');
	var stream = gulp.src('app/*.{html,php}')
		.pipe(log.working('<%= file.relative %>'))
		.pipe($.plumber({errorHandler: log.onError}))
		.pipe(indexOnly)
		.pipe($.php2html())
		.pipe($.compressor({
			type: 'html',
			// 'preserve-server-script': true,
			'compress-js': true,
			'compress-css': true,
			// 'preserve-comments': true
		}))
		.pipe(indexOnly.restore())
		.pipe(gulp.dest(PATHS.dest))
		.pipe(log.done('<%= file.relative %>'));

	stream
		.pipe($.filter('*.html'))
		.pipe($.w3cjs());//should be done asynchronously, so livereload doesn't have to wait for it

	return stream.pipe($.filter('index.html'));
}

function copyFiles () {
	gulp.src(['app/.htaccess','app/favicon.ico'])
	.pipe(gulp.dest(PATHS.dest))
	.pipe(log.done('<%= file.relative %>'));

	return gulp.src('app/assets/fonts/*')
	.pipe(gulp.dest(PATHS.assetsDest))
	.pipe(log.done('<%= file.relative %>'));
}
function optimizeImages() {
	var svgOnly = $.filter('*.svg');
	var imagesOnly = $.filter('!*.svg');

	return gulp.src(PATHS.imagesSrc)
		.pipe($.cached())
		.pipe(log.working('<%= file.relative %>'))

		.pipe(svgOnly)
		.pipe($.cache($.svgmin()))
		.pipe(svgOnly.restore())

		.pipe(imagesOnly)
		.pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true
		})))
		.pipe(imagesOnly.restore())

		.pipe(gulp.dest(PATHS.assetsDest));
}


// Watch
function watch() {
	var lr = $.livereload;
	gulp.watch('app/scss/**/*.scss', function () {
		buildStyle().pipe(lr());
	});
	gulp.watch(PATHS.imagesSrc, function () {
		optimizeImages().pipe(lr());
	});
	gulp.watch('app/**/*.{php,html}', function () {
		buildHTML().pipe(lr());
	});

	buildAndWatchScripts(lr);

	return lr();
}

// Function tasks
gulp.task('styles', buildStyle);
gulp.task('copy', copyFiles);
gulp.task('images', optimizeImages);
gulp.task('html', buildHTML);
gulp.task('watch', watch);
gulp.task('scripts', function () {
	return buildAndWatchScripts();//.task passes arguments
});

gulp.task('clear-cache', function () {
	$.cache.clearAll();
});

// Clean
gulp.task('clean', function () {
	return gulp.src([PATHS.dest+'/styles', PATHS.assetsDest, PATHS.dest+'/images'], {read: false})
		.pipe($.clean());
});

// Build
gulp.task('build', ['html', 'styles', 'copy', 'scripts', 'images']);

// Dev Server
gulp.task('dev', ['build', 'watch']);

// Default task
gulp.task('default', ['watch']);
