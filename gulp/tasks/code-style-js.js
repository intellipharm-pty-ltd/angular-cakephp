var gulp    = require('gulp');
var jscs    = require('gulp-jscs');
var plumber = require('gulp-plumber');
var ErrorHandler = require('../utils/error-handler');
var paths   = require('../paths');

gulp.task( 'code-style-js', function() {
    return gulp.src([ paths.files.src.non_test ])
        .pipe( plumber({ errorHandler: ErrorHandler }) )
        .pipe( jscs( paths.files.jscsrc ) );
});
