var changed    = require('gulp-changed');
var gulp       = require('gulp');
var config     = require('../config').copy;
var es         = require('event-stream');
var log        = require('../util/logging');

gulp.task('copy', function() {
	var groups = config.map(function (group) {
		return gulp.src(group.src)
			.pipe(changed(group.dest)) // Ignore unchanged files
			.pipe(log.working('<%= file.relative %>'))
			.pipe(gulp.dest(group.dest))
			.pipe(log.done('<%= file.relative %>'));
	});
	return es.merge.apply(es, groups);
});


