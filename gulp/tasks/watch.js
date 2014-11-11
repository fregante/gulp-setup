/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp  = require('gulp');
var config= require('../config');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
  gulp.watch(config.sass.src,   ['styles']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.markup.src, ['html']);

  config.copy.forEach(function (group) {
  	gulp.watch(group.src,       ['copy']);
  });
});