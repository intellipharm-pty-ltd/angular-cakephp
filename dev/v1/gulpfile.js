require('require-dir')('./gulp/tasks');

var gulp = require('gulp');
var runSequence = require('run-sequence');

//---------------------------------
// compile
//---------------------------------

gulp.task( 'compile', [], function( callback ) {
	return runSequence(
		[ 'lint-js', 'clean' ],// 'code-style-js' ],
		[ 'compile-es6', 'copy-index', 'copy-json' ],
		callback
	);
});

//---------------------------------
// run
//---------------------------------

gulp.task( 'run', [ 'compile' ], function ( callback ) {
	return runSequence([
		'browser-sync'
	], callback );
});

//---------------------------------
// test run
//---------------------------------

gulp.task( 'test-run', [], function ( callback ) {
	return runSequence(
		[ 'lint-js' ],// 'code-style-js' ],
		'unit-test-js-watch',
		callback
	);
});

//---------------------------------
// default
//---------------------------------

gulp.task( 'default', [ 'run' ] );
