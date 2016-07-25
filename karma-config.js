var paths = require('./gulp/paths');

var _config = {
    basePath: '',
    browsers: [ 'PhantomJS' ],
    frameworks: [ 'jspm', 'jasmine' ],
    reporters: [ 'mocha' ],//, 'coverage' ],
    port: 9876,
    plugins: [
        'karma-jasmine',
        'karma-jspm',
        'karma-phantomjs-launcher',
        // 'karma-chrome-launcher',
        'karma-babel-preprocessor',
        'karma-mocha-reporter'//,
        // 'karma-coverage'
    ],
    // files: [],
    // autoWatch: true,
    jspm: {
        // useBundles: true,
        // paths: {
        //     '*': 'src/*.js'
        // },
        // loadFiles: [ 'src/base-model/base-model2-spec.js' ],//paths.files.src.test ],
        loadFiles: [ paths.files.src.test ],
        serveFiles: [ paths.files.src.non_test ],
        config: paths.files.config.jspm
    },
    preprocessors: {}, // set below
    babelPreprocessor: {
        options: {
            // sourceMap: 'inline',
            // modules: 'system'
            presets: ['es2015']
        }
    },
    // coverageReporter: {
    //     dir: 'tests/coverage/',
    //     reporters: [
    //         {type: 'lcovonly', file: 'lcov.info', subdir: '.'},
    //         {type: 'html', subdir: '.'}
    //     ]
    // },
    mochaReporter: {
        output: 'minimal' // full, autowatch, minimal, noFailures
    },
    singleRun: false
};

_config.preprocessors[ paths.files.src.js ] = [ 'babel' ];//, 'coverage'];

module.exports = function ( config ) {

    _config.logLevel = config.LOG_INFO; // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG

    config.set( _config );
};
