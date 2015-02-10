module.exports = function (grunt) {
	return {
		dist: {
			options: {
				sourceMap: true
			},
			files: {
				'<%= config.dist %>/angular-cakephp.min.js': [
					'<%= config.lib %>/data-model.js',
					'<%= config.lib %>/data-model-settings.js',
					'<%= config.lib %>/**/*.js'
				],
			}
		}
	};
};
