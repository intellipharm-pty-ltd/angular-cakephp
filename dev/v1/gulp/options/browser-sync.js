var paths = require('../paths');

module.exports = {
	open: false,
	ui: false,
	notify: false,
	ghostMode: false,
	port: process.env.PORT || 9000,
	server: {
		baseDir: [ paths.dir.dest ],
		routes: {
			'/jspm-config.js': './jspm-config.js',
			'/jspm_packages': './jspm_packages',
			'/dist': '../../dist'
		}
	}
};
