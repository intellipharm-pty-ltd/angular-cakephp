module.exports = function (grunt) {
	return {
		dist: {
			options: {
				sourceMap: true,
				preserveComments: 'some'
			},
			files: {
				'<%= config.dist %>/angular-cakephp.min.js': [
					'<%= config.lib %>/angular-cakephp.js',
					'<%= config.lib %>/angular-cakephp-settings.js',
					'<%= config.lib %>/**/*.js'
				]
			}
		}
	};
};
