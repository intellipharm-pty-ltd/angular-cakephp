module.exports = function (grunt) {
    return {
        dist: {
            options: {
                sourceMap: true,
                preserveComments: 'none',
                banner: '/*!\n * <%= config.pkg.name %> v<%= config.pkg.version %>\n * http://intellipharm.com/\n *\n * Copyright 2015 Intellipharm\n *\n * <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n *\n */\n'
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
