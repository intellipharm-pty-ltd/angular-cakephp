module.exports = function(grunt) {
    grunt.registerTask('build', [
        'notify:build',
        'clean:dist',
        'concat:dist',
        'uglify:dist',
        'notify:buildComplete'
    ]);
}
