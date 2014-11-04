var notify = require('gulp-notify');
var util = require('gulp-util');
var log = {
    message: notify.withReporter(function (options, callback) {
        util.log(options.title+':', util.colors.magenta(options.message));
        callback();
    }),
    working: notify.withReporter(function (options, callback) {
        var additionalMessage = options.title!=='Gulp notification'?util.colors.magenta(options.title):'';
        util.log(util.colors.cyan('⦿'), options.message, additionalMessage);
        callback();
    }),
    done: notify.withReporter(function (options, callback) {
        var additionalMessage = options.title!=='Gulp notification'?util.colors.magenta(options.title):'';
        util.log(util.colors.green('✓'), options.message, additionalMessage);
        callback();
    }),
    error: notify.withReporter(function (options, callback) {
        if (options.title === 'Gulp notification' || options.title === 'Error running Gulp') {
            util.log('×', util.colors.red(options.message));
        } else {
            util.log(util.colors.red('×'), options.message, util.colors.red(options.title));
        }
        callback();
    })
};
log.onError = log.error.onError('<%= error.message %>');
notify.logLevel(0);

module.exports = log;