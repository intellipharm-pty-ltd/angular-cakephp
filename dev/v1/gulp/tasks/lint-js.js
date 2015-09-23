var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var ErrorHandler = require('../utils/error-handler');
var paths = require('../paths');

gulp.task( 'lint-js', function() {
    return gulp.src([ paths.files.src.js ])
        .pipe( plumber({ errorHandler: ErrorHandler }) )
        .pipe( jshint( paths.files.jshintrc ) )
        .pipe( jshint.reporter( 'jshint-stylish' ));
});
