'use strict';
/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.

   See browserify in gulp/config.js
*/

var gulp       = require('gulp');
var browserify = require('browserify');
var watchify   = require('watchify');
var source     = require('vinyl-source-stream');

var log        = require('../util/logging');

var configs    = require('../config').browserify;
var isFirstRun = true;

var $ = require('gulp-load-plugins')();

gulp.task('js', function(callback) {

  var bundleQueue = configs.length;

  var browserifyThis = function(bundleConfig) {

    var bundler = browserify({
      // Required watchify args
      cache: {}, packageCache: {}, fullPaths: true,
      // Specify the entry point of your app
      entries: bundleConfig.entries,
      // Enable source maps!
      debug: !!global.isWatching,

      basedir: './',
    });

    var bundle = function() {
      // Log when bundling starts
      log._working({message:bundleConfig.outputName});

      var bundle = bundler.bundle();

      if (!global.isDeploying) {
        // Report compile errors
      	bundle.on('error', log.onError);
      }

      bundle
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specify the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))

        .pipe($.if(!global.isWatching, $.buffer()))
        .pipe($.if(!global.isWatching, $.uglify()))

        .pipe(gulp.dest(bundleConfig.dest))
        .pipe(log.done('<%= file.relative %>'))
        .pipe($.if(function () {
        	var log = global.isWatching && isFirstRun;
        	isFirstRun = false;
        	reportFinished();
        	return log;
        }, log.info('JS files will be rebuilt on change')));

      return bundle;
    };

    if(global.isWatching) {
      // Wrap with watchify and rebundle on changes
      bundler = watchify(bundler);
      // Rebundle on update
      bundler.on('update', bundle);
    }

    var reportFinished = function() {
      if(bundleQueue) {
        bundleQueue--;
        if(bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          callback();
        }
      }
    };
    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  configs.forEach(browserifyThis);
});
