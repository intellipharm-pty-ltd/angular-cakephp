module.exports = {
    tests: {
        files: [{
            dot: true,
            src: [
                '<%= config.tests %>/<%= config.coverage %>/*'
            ]
        }]
    },
    build: {
        files: [{
            dot: true,
            src: [
                '.tmp',
                '<%= config.dist %>/*'
            ]
        }]
    }
};
