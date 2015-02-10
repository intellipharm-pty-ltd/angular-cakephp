module.exports = {
    options: {
        stripBanners: true,
        sourceMap: false
    },
    dist: {
    	dest: '<%= config.dist %>/angular-cakephp.js',
        src: [
            '<%= config.lib %>/data-model.js',
            '<%= config.lib %>/data-model-settings.js',
            '<%= config.lib %>/**/*.js'
        ]
    }
};
