var gulp = require('gulp');
var rename = require('gulp-rename');

var paths = require('../paths');

gulp.task( 'copy-index', function () {

    return gulp.src([ paths.files.src.index ])
        .pipe( rename( "index.html" ))
        .pipe( gulp.dest( paths.dir.dest ));
});
