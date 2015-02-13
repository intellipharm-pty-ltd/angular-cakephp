module.exports = {
    options: {
        stripBanners: true,
        sourceMap: false
    },
    dist: {
    	dest: '<%= config.dist %>/angular-cakephp.js',
        src: [
            '<%= config.lib %>/angular-cakephp.js',
            '<%= config.lib %>/angular-cakephp-settings.js',
            '<%= config.lib %>/**/*.js'
        ]
    }
};
