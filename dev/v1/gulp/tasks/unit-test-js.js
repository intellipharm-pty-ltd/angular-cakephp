var gulp   = require('gulp');
var karma = require('gulp-karma');
var paths = require('../paths');

gulp.task( 'unit-test-js', function() {

	return gulp.src( [] )
		.pipe( karma( {
			configFile: paths.files.config.karma,
			action: 'run'
		} ) )
		.on( 'error', function( err ) {
			this.emit( 'end' );
		} );
});

gulp.task( 'unit-test-js-watch', function() {

	return gulp.src( [] )
		.pipe( karma( {
			configFile: paths.files.config.karma,
			action: 'watch'
		} ) )
		.on( 'error', function( err ) {
			this.emit( 'end' );
		} );
});
