var SRC = "./src/";
var DEST = "./dist/";

module.exports = {
	dir: {
		src: SRC,
		dest: DEST,
		jspm_packages: './jspm_packages'
	},
	files: {
		jshintrc: '.jshintrc',
		src: {
			js: SRC + '**/*.js',
			source: SRC + '**/*.js',
			json: SRC + '**/*.json',
			index: SRC + 'index.html',
			test: SRC + '**/*-spec.js',
			non_test: SRC + '**/!(*-spec).js'
		},
		config: {
			karma: __dirname + '/../karma-config.js',
			jspm: './jspm-config.js'
		}
	}
};
