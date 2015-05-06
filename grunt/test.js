module.exports = function(grunt) {
    grunt.registerTask('test', [
        'clean:tests',
        'jshint:tests',
        'karma:test'
    ]);
};
