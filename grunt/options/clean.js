module.exports = {
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
