'use strict';
var gulp   = require('gulp');
var config = require('../config').images;
var log    = require('../util/logging');
var es     = require('event-stream');

var $ = require('gulp-load-plugins')();

gulp.task('images', function() {
  var stream = gulp.src(config.src)
		.pipe($.plumber({errorHandler: log.onError}))
    .pipe($.filter('**/*.{svg,png,jpeg,jpg,gif}'))
    .pipe($.changed(config.dest)) // Ignore unchanged files
		.pipe(log.working('<%= file.relative %>'));

	//preserve some SVG features that allow javascript editing
	var animatable = stream.pipe($.filter('animatable-svg/**'))
		.pipe($.imagemin({
			svgoPlugins: [{
				cleanupIDs: false,
				removeTitle: true,
				removeDesc: true
			}],
		}));

	var staticImages = stream.pipe($.filter(['**','!animatable-svg/**']))
		.pipe($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			svgoPlugins: [{
				removeTitle: true, //sketch adds unnecessary metadata
				removeDesc: true //sketch adds unnecessary metadata
			}],
		}));

	return es.merge(staticImages, animatable)
    .pipe(gulp.dest(config.dest))
		.pipe(log.done('<%= file.relative %>'));
});
