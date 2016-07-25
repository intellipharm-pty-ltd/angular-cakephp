'use strict';

var _angularCakephp = require('../angular-cakephp');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http_mock = function http_mock() {
    return new Promise(function (resolve, reject) {
        resolve({});
    });
};
var http_mock_reject = function http_mock_reject() {
    return new Promise(function (resolve, reject) {
        reject({});
    });
};

describe('RestApi', function () {

    beforeEach(function () {
        _angularCakephp.RestApi.reset();
    });

    //---------------------------------------------------
    // cache
    //---------------------------------------------------

    it('should not cache results', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path = 'BBB';
        _angularCakephp.RestApi.cacheControl = true;

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        _angularCakephp.RestApi.request();

        var expected_result = {
            headers: {},
            params: { cache: new Date().getTime() },
            url: 'AAABBB'
        };

        // assert
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expected_result);
    });

    //---------------------------------------------------
    // pathGenerator
    //---------------------------------------------------

    it('RestApi.path() should call RestApi.pathGenerator with the _.snakeCase of active_record_class name', function () {

        // spy
        _angularCakephp.RestApi.pathGenerator = jasmine.createSpy('pathGenerator');

        // prepare

        var AR = function (_ActiveRecord) {
            _inherits(AR, _ActiveRecord);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // call


        var r = _angularCakephp.RestApi.path(new AR());

        // assert
        expect(_angularCakephp.RestApi.pathGenerator).toHaveBeenCalledWith('ar');
    });

    //---------------------------------------------------
    // path
    //---------------------------------------------------

    it('Given a Class: RestApi.path() should call RestApi.pathGenerator with the active_record_class class\'s name, and return the result', function () {

        // spy
        _angularCakephp.RestApi.pathGenerator = jasmine.createSpy('pathGenerator').and.returnValue('AAA');

        // prepare

        var AR = function (_ActiveRecord2) {
            _inherits(AR, _ActiveRecord2);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // call


        var r = _angularCakephp.RestApi.path(new AR());

        // assert
        expect(_angularCakephp.RestApi.pathGenerator).toHaveBeenCalledWith('ar');
        expect(r).toEqual('AAA');
    });

    it('Given a Function: RestApi.path() should call RestApi.pathGenerator with the active_record_class function\'s name, and return the result', function () {

        // spy
        _angularCakephp.RestApi.pathGenerator = jasmine.createSpy('pathGenerator').and.returnValue('AAA');

        // prepare
        var AR = function AR() {};

        // call
        var r = _angularCakephp.RestApi.path(AR);

        // assert
        expect(_angularCakephp.RestApi.pathGenerator).toHaveBeenCalledWith('ar');
        expect(r).toEqual('AAA');
    });

    //---------------------------------------------------
    // url
    //---------------------------------------------------

    it('RestApi.url() should url if already set and if both active_record_class & config.path are not provided', function () {

        // prepare
        _angularCakephp.RestApi._url = 'AAA';

        // call
        var r = _angularCakephp.RestApi.url();

        // assert
        expect(r).toEqual('AAA');
    });

    it('get RestApi.url should throw an error if hostname is not set and is not provided via config.hostname', function () {

        _angularCakephp.RestApi._hostname = null;
        _angularCakephp.RestApi._path = 'AAA';

        var error_message = null;

        try {
            var r = _angularCakephp.RestApi.url();
        } catch (error) {
            error_message = error.message;
        }

        expect(error_message).toEqual(_angularCakephp.RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);
    });

    it('get RestApi.url should throw an error if hostname is not set and is not provided via config.hostname', function () {

        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path = null;

        var error_message = null;

        try {
            var r = _angularCakephp.RestApi.url();
        } catch (error) {
            error_message = error.message;
        }

        expect(error_message).toEqual(_angularCakephp.RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);
    });

    it('get RestApi.url should return combination of RestApi.hostname & RestApi.path', function () {

        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path = 'BBB';

        // call
        var r = _angularCakephp.RestApi.url();

        // assert
        expect(r).toEqual('AAABBB');
    });

    //----------------------------------------------------
    // request
    //----------------------------------------------------

    //----------------------------------------------------
    // request :: exceptions
    //----------------------------------------------------

    it('RestApi.request should throw an error if http is not set', function () {

        // prepare
        _angularCakephp.RestApi._http = null;

        // call & assert
        expect(_angularCakephp.RestApi.request).toThrowError(_angularCakephp.RestApi.MESSAGE_HTTP_REQUIRED);
    });

    //----------------------------------------------------
    // request :: no ActiveRecord
    //----------------------------------------------------

    it('RestApi.request should return object if no ActiveRecord is set', function (done) {

        // prepare
        var responseTransformer = jasmine.createSpy('responseTransformer').and.returnValue(new Promise(function (resolve, reject) {
            resolve('DDD');
        }));
        var responseHandler = jasmine.createSpy('responseHandler').and.returnValue(new Promise(function (resolve, reject) {
            resolve('CCC');
        }));
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi.hostname = 'AAA';
        _angularCakephp.RestApi.responseTransformer = responseTransformer;
        _angularCakephp.RestApi.responseHandler = responseHandler;

        // spies
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // prepare assert
        var assert = function assert(state, response) {
            expect(state).toEqual('PASS');
            done();
        };

        // call
        _angularCakephp.RestApi.request(null, { path: 'BBB' }).then(function (response) {
            assert('PASS', response);
        }, function (response) {
            assert('FAIL', response);
        });
    });

    //----------------------------------------------------
    // request :: args
    //----------------------------------------------------

    it('RestApi.request should ???? if a active_record_class is provided', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path = 'AAA';

        var AR = function (_ActiveRecord3) {
            _inherits(AR, _ActiveRecord3);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // call


        _angularCakephp.RestApi.request(AR);

        // assert
        // expect( ????? ).toEqual( ????? );
    });

    //----------------------------------------------------
    // request :: config param updates
    //----------------------------------------------------

    //---------------------------
    // headers
    //---------------------------

    it('RestApi.request should add headers request config', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path = 'BBB';
        _angularCakephp.RestApi._headers = { a: 'A' };

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        _angularCakephp.RestApi.request();

        var expected_result = {
            headers: { a: 'A' },
            url: 'AAABBB'
        };

        // assert
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expected_result);
    });

    it('if config.headers is provided, then RestApi.request should set request config by merging config.headers and RestApi.headers, with config.headers taking priority', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path = 'BBB';
        _angularCakephp.RestApi._headers = { a: 'A', c: 'C1' };

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        _angularCakephp.RestApi.request(null, { 'headers': { b: 'B', c: 'C2' } });

        var expected_result = {
            headers: { a: 'A', c: 'C2', b: 'B' },
            url: 'AAABBB'
        };

        // assert
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expected_result);
    });

    //---------------------------
    // paramSerializer
    //---------------------------

    it('if paramSerializer is set, then RestApi.request should add it to request config', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path = 'BBB';
        _angularCakephp.RestApi._headers = {};

        _angularCakephp.RestApi._param_serializer = 'CCC';

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        _angularCakephp.RestApi.request();

        var expected_result = {
            'headers': {},
            'paramSerializer': 'CCC',
            'url': 'AAABBB'
        };

        // assert
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expected_result);
    });

    it('if config.paramSerializer is provided, then RestApi.request should add config.paramSerializer to request config', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path = 'BBB';
        _angularCakephp.RestApi._headers = {};

        _angularCakephp.RestApi._param_serializer = 'CCC';

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        _angularCakephp.RestApi.request(null, { paramSerializer: 'DDD' });

        var expected_result = {
            'headers': {},
            'paramSerializer': 'DDD',
            'url': 'AAABBB'
        };

        // assert
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expected_result);
    });

    //---------------------------
    // url
    //---------------------------

    it('if url is set, then RestApi.request should add it to request config, instead of concating hostname & path', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._headers = {};

        _angularCakephp.RestApi._url = 'CCC';

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        _angularCakephp.RestApi.request();

        var expected_result = {
            'headers': {},
            'url': 'CCC'
        };

        // assert
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expected_result);
    });

    it('if config.url is provided, then RestApi.request should add config.paramSerializer to request config', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._headers = {};

        _angularCakephp.RestApi._url = 'CCC';

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        _angularCakephp.RestApi.request(null, { url: 'DDD' });

        var expected_result = {
            'headers': {},
            'url': 'DDD'
        };

        // assert
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expected_result);
    });

    //---------------------------
    // sub_path
    //---------------------------

    it('RestApi.request should append config.sub_path to config.url if set, and remove sub_path from config', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._url = 'CCC';

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        _angularCakephp.RestApi.request(null, { sub_path: 'DDD' });

        var expected_result = {
            'headers': {},
            'url': 'CCC/DDD'
        };

        // assert
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expected_result);
    });

    //---------------------------
    // Promise
    //---------------------------

    it('RestApi.request should return a promise', function () {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._url = 'AAA';

        // call
        var p = _angularCakephp.RestApi.request();

        // assert
        expect(p.then).toBeDefined();
    });

    //---------------------------
    // HTTP Service
    //---------------------------

    // it('RestApi.request should throw an error if HTTP Service does not return a promise', () => {
    //
    //     // prepare
    //     RestApi.http = () => { return 'AAA'; };
    //     RestApi._url = 'BBB';
    //
    //     // call & assert
    //     expect( RestApi.request ).toThrowError( RestApi.MESSAGE_INVALID_HTTP_SERVICE );
    //
    // });

    //---------------------------
    // Transformers
    //---------------------------

    it('RestApi.request should (on success) call successTransformer with response & active_record_class. successTransformer should supersede responseTransformer.', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};

        var AR = function (_ActiveRecord4) {
            _inherits(AR, _ActiveRecord4);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // spy


        spyOn(_angularCakephp.RestApi, 'responseTransformer');
        spyOn(_angularCakephp.RestApi, 'successTransformer');

        // call & assert
        _angularCakephp.RestApi.request(AR).then(function (response) {
            expect(_angularCakephp.RestApi.responseTransformer).not.toHaveBeenCalled();
            expect(_angularCakephp.RestApi.successTransformer).toHaveBeenCalledWith({}, AR);
            done();
        });
    });

    it('RestApi.request should (on success) call responseTransformer with response & active_record_class, if no successTransformer is provided', function (done) {

        // prepare
        // RestApi.http        = http_mock;
        _angularCakephp.RestApi.http = function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        };
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};

        var AR = function (_ActiveRecord5) {
            _inherits(AR, _ActiveRecord5);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // spy


        spyOn(_angularCakephp.RestApi, 'responseTransformer');

        // call & assert
        _angularCakephp.RestApi.request(AR).then(function (response) {
            expect(_angularCakephp.RestApi.responseTransformer).toHaveBeenCalledWith({}, AR);
            done();
        });
    });

    it('RestApi.request should (on error) call errorTransformer with response & active_record_class. errorTransformer should supersede responseTransformer.', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock_reject;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};

        var AR = function (_ActiveRecord6) {
            _inherits(AR, _ActiveRecord6);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // spy


        spyOn(_angularCakephp.RestApi, 'responseTransformer');
        spyOn(_angularCakephp.RestApi, 'errorTransformer');

        // call & assert
        _angularCakephp.RestApi.request(AR).then(function (response) {}, function (response) {
            expect(_angularCakephp.RestApi.responseTransformer).not.toHaveBeenCalled();
            expect(_angularCakephp.RestApi.errorTransformer).toHaveBeenCalledWith({}, AR);
            done();
        });
    });

    it('RestApi.request should (on error) call responseTransformer with response & active_record_class, if no errorTransformer is provided', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock_reject;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};

        var AR = function (_ActiveRecord7) {
            _inherits(AR, _ActiveRecord7);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // spy


        spyOn(_angularCakephp.RestApi, 'responseTransformer');

        // call & assert
        _angularCakephp.RestApi.request(AR).then(function (response) {}, function (response) {
            expect(_angularCakephp.RestApi.responseTransformer).toHaveBeenCalledWith({}, AR);
            done();
        });
    });

    //---------------------------
    // Handlers
    //---------------------------

    it('RestApi.request should (on success) call successHandler with transformed response, and resolve only when successHandler resolves. successHandler should supersede responseHandler.', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};
        _angularCakephp.RestApi.responseTransformer = function () {
            return 'BBB';
        };

        var AR = function (_ActiveRecord8) {
            _inherits(AR, _ActiveRecord8);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // spy


        _angularCakephp.RestApi.responseHandler = jasmine.createSpy('responseHandler');
        _angularCakephp.RestApi.successHandler = jasmine.createSpy('successHandler').and.returnValue(new Promise(function (resolve, reject) {
            resolve();
        }));

        // call & assert
        _angularCakephp.RestApi.request(AR).then(function (response) {
            expect(_angularCakephp.RestApi.responseHandler).not.toHaveBeenCalled();
            expect(_angularCakephp.RestApi.successHandler).toHaveBeenCalledWith('BBB');
            done();
        });
    });

    it('RestApi.request should (on success) call responseHandler with response, if no successHandler is provided, and resolve only when responseHandler resolves', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};
        _angularCakephp.RestApi.responseTransformer = function () {
            return 'BBB';
        };

        var AR = function (_ActiveRecord9) {
            _inherits(AR, _ActiveRecord9);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // spy


        _angularCakephp.RestApi.responseHandler = jasmine.createSpy('responseHandler').and.returnValue(new Promise(function (resolve, reject) {
            resolve();
        }));

        // call & assert
        _angularCakephp.RestApi.request(AR).then(function (response) {
            expect(_angularCakephp.RestApi.responseHandler).toHaveBeenCalledWith('BBB');
            done();
        });
    });

    it('RestApi.request should (on success) resolve immediately with response if neither responseHandler nor successHandler are provided', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};
        _angularCakephp.RestApi.responseTransformer = function () {
            return 'BBB';
        };

        var AR = function (_ActiveRecord10) {
            _inherits(AR, _ActiveRecord10);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // call & assert


        _angularCakephp.RestApi.request(AR).then(function (response) {
            expect(response).toEqual('BBB');
            done();
        });
    });

    it('RestApi.request should (on error) call errorHandler with transformed response, and resolve only when errorHandler resolves', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock_reject;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};
        _angularCakephp.RestApi.responseTransformer = function () {
            return 'BBB';
        };

        var AR = function (_ActiveRecord11) {
            _inherits(AR, _ActiveRecord11);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // spy


        _angularCakephp.RestApi.responseHandler = jasmine.createSpy('responseHandler');
        _angularCakephp.RestApi.errorHandler = jasmine.createSpy('errorHandler').and.returnValue(new Promise(function (resolve, reject) {
            resolve();
        }));

        // call & assert
        _angularCakephp.RestApi.request(AR).then(function (response) {
            expect(_angularCakephp.RestApi.responseHandler).not.toHaveBeenCalled();
            expect(_angularCakephp.RestApi.errorHandler).toHaveBeenCalledWith('BBB');
            done();
        });
    });

    it('RestApi.request should (on error) call response_handler with response, if no error_handler is provided, and resolve only when responseHandler resolves', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock_reject;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};
        _angularCakephp.RestApi.responseTransformer = function () {
            return 'BBB';
        };

        var AR = function (_ActiveRecord12) {
            _inherits(AR, _ActiveRecord12);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // spy


        _angularCakephp.RestApi.responseHandler = jasmine.createSpy('responseHandler').and.returnValue(new Promise(function (resolve, reject) {
            resolve();
        }));

        // call & assert
        _angularCakephp.RestApi.request(AR).then(function (response) {
            expect(_angularCakephp.RestApi.responseHandler).toHaveBeenCalledWith('BBB');
            done();
        });
    });

    it('RestApi.request should (on error) reject immediately with response if neither responseHandler nor error_handler are provided', function (done) {

        // prepare
        _angularCakephp.RestApi.http = http_mock_reject;
        _angularCakephp.RestApi._headers = {};
        _angularCakephp.RestApi._hostname = 'AAA';
        _angularCakephp.RestApi._path_generator = function () {};
        _angularCakephp.RestApi.responseTransformer = function () {
            return 'BBB';
        };

        var AR = function (_ActiveRecord13) {
            _inherits(AR, _ActiveRecord13);

            function AR() {
                _classCallCheck(this, AR);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(AR).apply(this, arguments));
            }

            return AR;
        }(_angularCakephp.ActiveRecord);

        // call & assert


        _angularCakephp.RestApi.request(AR).then(function (response) {}, function (response) {
            expect(response).toEqual('BBB');
            done();
        });
    });

    //---------------------------------------------------
    // index
    //---------------------------------------------------

    it('RestApi.index should return the result of request', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // call
        var r = _angularCakephp.RestApi.index(null);

        // assert
        expect(r).toEqual('BBB');
    });

    it('RestApi.index should set request_config.method to GET', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // call
        _angularCakephp.RestApi.index('AAA');

        // assert
        var expected_config = {
            method: 'GET'
        };
        expect(_angularCakephp.RestApi.request).toHaveBeenCalledWith('AAA', expected_config);
    });

    //---------------------------------------------------
    // view
    //---------------------------------------------------

    it('RestApi.view should throw an error if id is not provided', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // assert
        expect(_angularCakephp.RestApi.view).toThrowError(_angularCakephp.RestApi.MESSAGE_ID_IS_REQURIED);
    });

    it('RestApi.view should return the result of request', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // call
        var r = _angularCakephp.RestApi.view(null, 111);

        // assert
        expect(r).toEqual('BBB');
    });

    it('RestApi.view should set request_config.method to GET & sub_path to id parameters', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // call
        _angularCakephp.RestApi.view('AAA', 111);

        // assert
        var expected_config = {
            method: 'GET',
            sub_path: 111
        };
        expect(_angularCakephp.RestApi.request).toHaveBeenCalledWith('AAA', expected_config);
    });

    //---------------------------------------------------
    // add
    //---------------------------------------------------

    it('RestApi.add should return the result of request', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // call
        var r = _angularCakephp.RestApi.add(null);

        // assert
        expect(r).toEqual('BBB');
    });

    it('RestApi.add should set request_config.method to POST', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // call
        _angularCakephp.RestApi.add('AAA');

        // assert
        var expected_config = {
            method: 'POST'
        };
        expect(_angularCakephp.RestApi.request).toHaveBeenCalledWith('AAA', expected_config);
    });

    //---------------------------------------------------
    // edit
    //---------------------------------------------------

    it('RestApi.edit should throw an error if id is not provided', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // assert
        expect(_angularCakephp.RestApi.edit).toThrowError(_angularCakephp.RestApi.MESSAGE_ID_IS_REQURIED);
    });

    it('RestApi.edit should return the result of request', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');
        spyOn(_angularCakephp.RestApi, 'formatSubPath').and.returnValue('CCC');

        // call
        var r = _angularCakephp.RestApi.edit(null, 111);

        // assert
        expect(r).toEqual('BBB');
    });

    it('RestApi.edit should set request_config.method to PUT & request_config.sub_path to the result of RestApi.formatSubPath', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');
        spyOn(_angularCakephp.RestApi, 'formatSubPath').and.returnValue('CCC');

        // call
        _angularCakephp.RestApi.edit('AAA', 111);

        // assert
        var expected_config = {
            method: 'PUT',
            sub_path: 'CCC'
        };
        expect(_angularCakephp.RestApi.request).toHaveBeenCalledWith('AAA', expected_config);
        expect(_angularCakephp.RestApi.formatSubPath).toHaveBeenCalledWith(111, expected_config);
    });

    //---------------------------------------------------
    // delete
    //---------------------------------------------------

    it('RestApi.delete should throw an error if id is not provided', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');

        // assert
        expect(_angularCakephp.RestApi.delete).toThrowError(_angularCakephp.RestApi.MESSAGE_ID_IS_REQURIED);
    });

    it('RestApi.delete should return the result of request', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');
        spyOn(_angularCakephp.RestApi, 'formatSubPath').and.returnValue('CCC');

        // call
        var r = _angularCakephp.RestApi.delete(null, 111);

        // assert
        expect(r).toEqual('BBB');
    });

    it('RestApi.delete should set request_config.method to PUT & request_config.sub_path to the result of RestApi.formatSubPath', function () {

        // spies
        spyOn(_angularCakephp.RestApi, 'request').and.returnValue('BBB');
        spyOn(_angularCakephp.RestApi, 'formatSubPath').and.returnValue('CCC');

        // call
        _angularCakephp.RestApi.delete('AAA', 111);

        // assert
        var expected_config = {
            method: 'DELETE',
            sub_path: 'CCC'
        };
        expect(_angularCakephp.RestApi.request).toHaveBeenCalledWith('AAA', expected_config);
        expect(_angularCakephp.RestApi.formatSubPath).toHaveBeenCalledWith(111, expected_config);
    });

    //---------------------------------------------------
    // formatSubPath
    //---------------------------------------------------

    it('RestApi.formatSubPath should return if no sub_path is set in config', function () {

        // call
        var r = _angularCakephp.RestApi.formatSubPath(111);

        // assert
        expect(r).toEqual('111');
    });

    it('RestApi.formatSubPath should add a slash when concatenating id and config.sub_path', function () {

        // call
        var r = _angularCakephp.RestApi.formatSubPath(111, { sub_path: 'AAA' });

        // assert
        expect(r).toEqual('111/AAA');
    });

    it('RestApi.formatSubPath should add a slash when concatenating id and config.sub_path if config.sub_path already starts with a slash', function () {

        // call
        var r = _angularCakephp.RestApi.formatSubPath(111, { sub_path: '/AAA' });

        // assert
        expect(r).toEqual('111/AAA');
    });
});