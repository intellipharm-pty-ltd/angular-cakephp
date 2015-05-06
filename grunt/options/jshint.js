module.exports = {
    options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
    },
    lib: ['<%= config.lib %>/**/*.js'],
    tests: ['karma.conf.js', '<%= config.tests %>/**/*.js', '!<%= config.tests %>/<%= config.coverage %>/**/*.js'],
    grunt: ['Gruntfile.js', '<%= config.grunt %>/**/*.js']
};
