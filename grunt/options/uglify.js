module.exports = {
    build: {
        options: {
            sourceMap: true,
            sourceMapName: '<%= config.dist %>/angular-cakephp.min.map',
            preserveComments: 'none',
            screwIE8: true, // this currently only saves around 100 bytes, so it's not really worth it
            banner: '/*!\n * <%= config.pkg.name %> v<%= config.pkg.version %>\n * http://intellipharm.com/\n *\n * Copyright 2015 Intellipharm\n *\n * <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n *\n */'
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
