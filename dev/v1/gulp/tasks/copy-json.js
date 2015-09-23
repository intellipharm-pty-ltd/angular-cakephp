var gulp = require('gulp');
// var changed = require('gulp-changed');
var rename = require('gulp-rename');

var paths = require('../paths');

gulp.task( 'copy-json', function () {
    return gulp.src([ paths.files.src.json ])
        .pipe( rename( {} ))
        .pipe( gulp.dest( paths.dir.dest ));
});
