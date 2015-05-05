module.exports = function(grunt) {
    grunt.registerTask('build', [
        'notify:build',
        'jshint',
        'jscs',
        'karma:build',
        'clean:build',
        'concat:build',
        'uglify:build',
        'notify:buildComplete'
    ]);
};
