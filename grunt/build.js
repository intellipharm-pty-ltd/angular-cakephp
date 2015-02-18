module.exports = function(grunt) {
    grunt.registerTask('build', [
        'notify:build',
        'jshint:lib',
        'jshint:tests',
        'clean:dist',
        'concat:dist',
        'uglify:dist',
        'notify:buildComplete'
    ]);
};
