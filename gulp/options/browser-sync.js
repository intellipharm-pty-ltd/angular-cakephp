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
			'/config.js': paths.config.jspm,
			'/jspm-config.js': paths.config.jspm,
			'/jspm_packages': paths.dir.jspm_packages
		}
	}
};
