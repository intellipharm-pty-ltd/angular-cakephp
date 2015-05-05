module.exports = {
    options: {
        config: '.jscsrc'
    },
    lib: ['<%= config.lib %>/**/*.js'],
    tests: ['karma.conf.js', '<%= config.tests %>/**/*.js'],
    grunt: ['Gruntfile.js', '<%= config.grunt %>/**/*.js']
};
