var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

var paths = require('../paths');
var browser_sync_options = require('../options/browser-sync');

gulp.task( 'browser-sync', function ( gulpCallback ) {

    browserSync.init( browser_sync_options );

    // reload on change

    gulp.watch( paths.files.src.js, [ 'compile-es6' ] ).on('change', browserSync.reload );
    gulp.watch( paths.files.src.index, [ 'copy-index' ] ).on('change', browserSync.reload );

    // notify gulp that this task is done
    gulpCallback();
});
