var gutil = require('gulp-util');
var notifier = require('node-notifier');

module.exports = function(err) {

    // beep (doesn't work)
    gutil.beep();

    // log
    gutil.log( gutil.colors.red('ERROR: compile-es6') + ' ' + gutil.colors.yellow(err.name) );
    gutil.log( gutil.colors.white(err.message) );

    // notify
    notifier.notify({
        'title': 'ERROR: compile-es6  ' + err.name,
        'message':err.message
    });
};
