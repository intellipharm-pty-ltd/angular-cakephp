var gulp = require('gulp');
var babel = require('gulp-babel');
var changed = require('gulp-changed');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

var ErrorHandler = require('../utils/error-handler');

var babel_compiler_options = require('../options/babel');
var paths = require('../paths');

gulp.task('compile-es6', function () {
    return gulp.src( paths.files.src.js, {} )
        .pipe( plumber({ errorHandler: ErrorHandler }) )
        .pipe( changed( paths.dir.dest, { extension: '.js' }))
        // .pipe( sourcemaps.init( { loadMaps: true } ))
        .pipe( babel( babel_compiler_options ))
        .pipe( ngAnnotate({
            sourceMap: false,
            gulpWarnings: true
        }))
        // .pipe( sourcemaps.write( "/sourcemaps", { sourceRoot: paths.files.src.js }))
        .pipe( gulp.dest( paths.dir.dest ));
});
