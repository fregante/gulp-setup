'use strict';
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var config      = require('../config').browserSync;
var isEnabled   = true;

gulp.task('browserSync-disable', function() {
	isEnabled = false;
});
gulp.task('browserSync', function() {
	if (isEnabled) {
  	browserSync(config);
	}
});
