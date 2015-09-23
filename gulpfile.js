require('require-dir')('gulp/tasks');

var gulp = require('gulp');
var runSequence = require('run-sequence');

var paths = require('./gulp/paths');

//---------------------------------
// compile
//---------------------------------

gulp.task( 'compile', [], function( callback ) {
	return runSequence(
		[ 'lint-js', 'code-style-js', 'clean' ],
		'unit-test-js',
		'compile-es6',
		callback
	);
});

//---------------------------------
// run
//---------------------------------

gulp.task( 'run', [	'compile' ], function ( callback ) {
	gulp.watch( paths.files.src.js, [ 'compile-es6' ] );
});

//---------------------------------
// test run
//---------------------------------

gulp.task( 'test-run', [], function ( callback ) {
	return runSequence(
		[ 'lint-js', 'code-style-js' ],
		'unit-test-js-watch',
		callback
	);
});

//---------------------------------
// default
//---------------------------------

gulp.task( 'default', [ 'run' ] );
