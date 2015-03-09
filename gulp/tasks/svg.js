'use strict';
var gulp   = require('gulp');
var config = require('../config').svg;
var log    = require('../util/logging');

var $ = require('gulp-load-plugins')();

gulp.task('svg', function() {
  return gulp.src(config.src)
		.pipe(log.working('<%= file.relative %>'))
		.pipe($.imagemin({
			svgoPlugins: [{
				removeTitle: true, //sketch adds unnecessary metadata
				removeDesc: true //sketch adds unnecessary metadata
			}],
		}))//svgstore crashes without this here
		.pipe($.rename({prefix: 'symbol-'}))
		.pipe($.svgstore())
		// .pipe($.imagemin())
		.pipe(gulp.dest(config.dest))
		.pipe(log.done('<%= file.relative %>'));
});
