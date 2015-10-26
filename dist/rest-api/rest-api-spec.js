System.register(['../angular-cakephp'], function (_export) {
    'use strict';

    var ActiveRecord, BaseModel, RestApi, http_mock, http_mock_reject;

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    return {
        setters: [function (_angularCakephp) {
            ActiveRecord = _angularCakephp.ActiveRecord;
            BaseModel = _angularCakephp.BaseModel;
            RestApi = _angularCakephp.RestApi;
        }],
        execute: function () {
            http_mock = function http_mock() {
                return new Promise(function (resolve, reject) {
                    resolve({});
                });
            };

            http_mock_reject = function http_mock_reject() {
                return new Promise(function (resolve, reject) {
                    reject({});
                });
            };

            describe('RestApi', function () {

                beforeEach(function () {
                    RestApi.reset();
                });

                //---------------------------------------------------
                // pathGenerator
                //---------------------------------------------------

                it("RestApi.path() should call RestApi.pathGenerator with the _.snakeCase of active_record_class name", function () {

                    // spy
                    RestApi.pathGenerator = jasmine.createSpy('pathGenerator');

                    // prepare

                    var AR = (function (_ActiveRecord) {
                        _inherits(AR, _ActiveRecord);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // call
                        return AR;
                    })(ActiveRecord);

                    var r = RestApi.path(AR);

                    // assert
                    expect(RestApi.pathGenerator).toHaveBeenCalledWith('ar');
                });

                //---------------------------------------------------
                // path
                //---------------------------------------------------

                it("Given a Class: RestApi.path() should call RestApi.pathGenerator with the active_record_class class's name, and return the result", function () {

                    // spy
                    RestApi.pathGenerator = jasmine.createSpy('pathGenerator').and.returnValue("AAA");

                    // prepare

                    var AR = (function (_ActiveRecord2) {
                        _inherits(AR, _ActiveRecord2);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // call
                        return AR;
                    })(ActiveRecord);

                    var r = RestApi.path(AR);

                    // assert
                    expect(RestApi.pathGenerator).toHaveBeenCalledWith('ar');
                    expect(r).toEqual("AAA");
                });

                it("Given a Function: RestApi.path() should call RestApi.pathGenerator with the active_record_class function's name, and return the result", function () {

                    // spy
                    RestApi.pathGenerator = jasmine.createSpy('pathGenerator').and.returnValue("AAA");

                    // prepare
                    var AR = function AR() {};

                    // call
                    var r = RestApi.path(AR);

                    // assert
                    expect(RestApi.pathGenerator).toHaveBeenCalledWith('ar');
                    expect(r).toEqual("AAA");
                });

                //---------------------------------------------------
                // url
                //---------------------------------------------------

                it("RestApi.url() should url if already set and if both active_record_class & config.path are not provided", function () {

                    // prepare
                    RestApi._url = "AAA";

                    // call
                    var r = RestApi.url();

                    // assert
                    expect(r).toEqual("AAA");
                });

                it("get RestApi.url should throw an error if hostname is not set and is not provided via config.hostname", function () {

                    RestApi._hostname = null;
                    RestApi._path = "AAA";

                    try {
                        var r = RestApi.url();
                    } catch (error) {
                        var error_message = error.message;
                    }

                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);
                });

                it("get RestApi.url should throw an error if hostname is not set and is not provided via config.hostname", function () {

                    RestApi._hostname = "AAA";
                    RestApi._path = null;

                    try {
                        var r = RestApi.url();
                    } catch (error) {
                        var error_message = error.message;
                    }

                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);
                });

                it("get RestApi.url should return combination of RestApi.hostname & RestApi.path", function () {

                    RestApi._hostname = "AAA";
                    RestApi._path = "BBB";

                    // call
                    var r = RestApi.url();

                    // assert
                    expect(r).toEqual("AAABBB");
                });

                //----------------------------------------------------
                // request
                //----------------------------------------------------

                //----------------------------------------------------
                // request :: exceptions
                //----------------------------------------------------

                it("RestApi.request should throw an error if http is not set", function () {

                    // prepare
                    RestApi._http = null;

                    // call & assert
                    expect(RestApi.request).toThrowError(RestApi.MESSAGE_HTTP_REQUIRED);
                });

                //----------------------------------------------------
                // request :: no ActiveRecord
                //----------------------------------------------------

                it("RestApi.request should return object if no ActiveRecord is set", function (done) {

                    // prepare
                    var responseTransformer = jasmine.createSpy('responseTransformer').and.returnValue(new Promise(function (resolve, reject) {
                        resolve("DDD");
                    }));
                    var responseHandler = jasmine.createSpy('responseHandler').and.returnValue(new Promise(function (resolve, reject) {
                        resolve("CCC");
                    }));
                    RestApi.http = http_mock;
                    RestApi.hostname = "AAA";
                    RestApi.responseTransformer = responseTransformer;
                    RestApi.responseHandler = responseHandler;

                    // spies
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // prepare assert
                    var assert = function assert(state, response) {
                        expect(state).toEqual("PASS");
                        done();
                    };

                    // call
                    RestApi.request(null, { path: "BBB" }).then(function (response) {
                        assert("PASS", response);
                    }, function (response) {
                        assert("FAIL", response);
                    });
                });

                //----------------------------------------------------
                // request :: args
                //----------------------------------------------------

                it("RestApi.request should ???? if a active_record_class is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._hostname = "AAA";
                    RestApi._path = "AAA";

                    var AR = (function (_ActiveRecord3) {
                        _inherits(AR, _ActiveRecord3);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // call
                        return AR;
                    })(ActiveRecord);

                    RestApi.request(AR);

                    // assert
                    // expect( ????? ).toEqual( ????? );
                });

                //----------------------------------------------------
                // request :: config param updates
                //----------------------------------------------------

                //---------------------------
                // headers
                //---------------------------

                it("RestApi.request should add headers request config", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._hostname = "AAA";
                    RestApi._path = "BBB";
                    RestApi._headers = { a: "A" };

                    // spy
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // call
                    RestApi.request();

                    var expected_result = {
                        headers: { a: "A" },
                        url: "AAABBB"
                    };

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith(expected_result);
                });

                it("if config.headers is provided, then RestApi.request should set request config by merging config.headers and RestApi.headers, with config.headers taking priority", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._hostname = "AAA";
                    RestApi._path = "BBB";
                    RestApi._headers = { a: "A", c: "C1" };

                    // spy
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // call
                    RestApi.request(null, { "headers": { b: "B", c: "C2" } });

                    var expected_result = {
                        headers: { a: "A", c: "C2", b: "B" },
                        url: "AAABBB"
                    };

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith(expected_result);
                });

                //---------------------------
                // paramSerializer
                //---------------------------

                it("if paramSerializer is set, then RestApi.request should add it to request config", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._hostname = "AAA";
                    RestApi._path = "BBB";
                    RestApi._headers = {};

                    RestApi._param_serializer = "CCC";

                    // spy
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // call
                    RestApi.request();

                    var expected_result = {
                        "headers": {},
                        "paramSerializer": "CCC",
                        "url": "AAABBB"
                    };

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith(expected_result);
                });

                it("if config.paramSerializer is provided, then RestApi.request should add config.paramSerializer to request config", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._hostname = "AAA";
                    RestApi._path = "BBB";
                    RestApi._headers = {};

                    RestApi._param_serializer = "CCC";

                    // spy
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // call
                    RestApi.request(null, { paramSerializer: "DDD" });

                    var expected_result = {
                        "headers": {},
                        "paramSerializer": "DDD",
                        "url": "AAABBB"
                    };

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith(expected_result);
                });

                //---------------------------
                // url
                //---------------------------

                it("if url is set, then RestApi.request should add it to request config, instead of concat'ing hostname & path", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._headers = {};

                    RestApi._url = "CCC";

                    // spy
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // call
                    RestApi.request();

                    var expected_result = {
                        "headers": {},
                        "url": "CCC"
                    };

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith(expected_result);
                });

                it("if config.url is provided, then RestApi.request should add config.paramSerializer to request config", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._headers = {};

                    RestApi._url = "CCC";

                    // spy
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // call
                    RestApi.request(null, { url: "DDD" });

                    var expected_result = {
                        "headers": {},
                        "url": "DDD"
                    };

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith(expected_result);
                });

                //---------------------------
                // sub_path
                //---------------------------

                it("RestApi.request should append config.sub_path to config.url if set, and remove sub_path from config", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._headers = {};
                    RestApi._url = "CCC";

                    // spy
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // call
                    RestApi.request(null, { sub_path: "DDD" });

                    var expected_result = {
                        "headers": {},
                        "url": "CCC/DDD"
                    };

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith(expected_result);
                });

                //---------------------------
                // Promise
                //---------------------------

                it("RestApi.request should return a promise", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._url = "AAA";

                    // call
                    var p = RestApi.request();

                    // assert
                    expect(p.then).toBeDefined();
                });

                //---------------------------
                // HTTP Service
                //---------------------------

                it("RestApi.request should throw an error if HTTP Service does not return a promise", function () {

                    // prepare
                    RestApi.http = function () {
                        return "AAA";
                    };
                    RestApi._url = "BBB";

                    // call & assert
                    expect(RestApi.request).toThrowError(RestApi.MESSAGE_INVALID_HTTP_SERVICE);
                });

                //---------------------------
                // Transformers
                //---------------------------

                it("RestApi.request should (on success) call successTransformer with response & active_record_class. successTransformer should supersede responseTransformer.", function (done) {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};

                    var AR = (function (_ActiveRecord4) {
                        _inherits(AR, _ActiveRecord4);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // spy
                        return AR;
                    })(ActiveRecord);

                    spyOn(RestApi, 'responseTransformer');
                    spyOn(RestApi, 'successTransformer');

                    // call & assert
                    RestApi.request(AR).then(function (response) {
                        expect(RestApi.responseTransformer).not.toHaveBeenCalled();
                        expect(RestApi.successTransformer).toHaveBeenCalledWith({}, AR);
                        done();
                    });
                });

                it("RestApi.request should (on success) call responseTransformer with response & active_record_class, if no successTransformer is provided", function (done) {

                    // prepare
                    // RestApi.http        = http_mock;
                    RestApi.http = function () {
                        return new Promise(function (resolve, reject) {
                            resolve({});
                        });
                    };
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};

                    var AR = (function (_ActiveRecord5) {
                        _inherits(AR, _ActiveRecord5);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // spy
                        return AR;
                    })(ActiveRecord);

                    spyOn(RestApi, 'responseTransformer');

                    // call & assert
                    RestApi.request(AR).then(function (response) {
                        expect(RestApi.responseTransformer).toHaveBeenCalledWith({}, AR);
                        done();
                    });
                });

                it("RestApi.request should (on error) call errorTransformer with response & active_record_class. errorTransformer should supersede responseTransformer.", function (done) {

                    // prepare
                    RestApi.http = http_mock_reject;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};

                    var AR = (function (_ActiveRecord6) {
                        _inherits(AR, _ActiveRecord6);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // spy
                        return AR;
                    })(ActiveRecord);

                    spyOn(RestApi, 'responseTransformer');
                    spyOn(RestApi, 'errorTransformer');

                    // call & assert
                    RestApi.request(AR).then(function (response) {}, function (response) {
                        expect(RestApi.responseTransformer).not.toHaveBeenCalled();
                        expect(RestApi.errorTransformer).toHaveBeenCalledWith({}, AR);
                        done();
                    });
                });

                it("RestApi.request should (on error) call responseTransformer with response & active_record_class, if no errorTransformer is provided", function (done) {

                    // prepare
                    RestApi.http = http_mock_reject;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};

                    var AR = (function (_ActiveRecord7) {
                        _inherits(AR, _ActiveRecord7);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // spy
                        return AR;
                    })(ActiveRecord);

                    spyOn(RestApi, 'responseTransformer');

                    // call & assert
                    RestApi.request(AR).then(function (response) {}, function (response) {
                        expect(RestApi.responseTransformer).toHaveBeenCalledWith({}, AR);
                        done();
                    });
                });

                //---------------------------
                // Handlers
                //---------------------------

                it("RestApi.request should (on success) call successHandler with transformed response, and resolve only when successHandler resolves. successHandler should supersede responseHandler.", function (done) {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};
                    RestApi.responseTransformer = function () {
                        return "BBB";
                    };

                    var AR = (function (_ActiveRecord8) {
                        _inherits(AR, _ActiveRecord8);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // spy
                        return AR;
                    })(ActiveRecord);

                    RestApi.responseHandler = jasmine.createSpy('responseHandler');
                    RestApi.successHandler = jasmine.createSpy('successHandler').and.returnValue(new Promise(function (resolve, reject) {
                        resolve();
                    }));

                    // call & assert
                    RestApi.request(AR).then(function (response) {
                        expect(RestApi.responseHandler).not.toHaveBeenCalled();
                        expect(RestApi.successHandler).toHaveBeenCalledWith("BBB");
                        done();
                    });
                });

                it("RestApi.request should (on success) call responseHandler with response, if no successHandler is provided, and resolve only when responseHandler resolves", function (done) {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};
                    RestApi.responseTransformer = function () {
                        return "BBB";
                    };

                    var AR = (function (_ActiveRecord9) {
                        _inherits(AR, _ActiveRecord9);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // spy
                        return AR;
                    })(ActiveRecord);

                    RestApi.responseHandler = jasmine.createSpy('responseHandler').and.returnValue(new Promise(function (resolve, reject) {
                        resolve();
                    }));

                    // call & assert
                    RestApi.request(AR).then(function (response) {
                        expect(RestApi.responseHandler).toHaveBeenCalledWith("BBB");
                        done();
                    });
                });

                it("RestApi.request should (on success) resolve immediately with response if neither responseHandler nor successHandler are provided", function (done) {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};
                    RestApi.responseTransformer = function () {
                        return "BBB";
                    };

                    var AR = (function (_ActiveRecord10) {
                        _inherits(AR, _ActiveRecord10);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // call & assert
                        return AR;
                    })(ActiveRecord);

                    RestApi.request(AR).then(function (response) {
                        expect(response).toEqual("BBB");
                        done();
                    });
                });

                it("RestApi.request should (on error) call errorHandler with transformed response, and resolve only when errorHandler resolves", function (done) {

                    // prepare
                    RestApi.http = http_mock_reject;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};
                    RestApi.responseTransformer = function () {
                        return "BBB";
                    };

                    var AR = (function (_ActiveRecord11) {
                        _inherits(AR, _ActiveRecord11);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // spy
                        return AR;
                    })(ActiveRecord);

                    RestApi.responseHandler = jasmine.createSpy('responseHandler');
                    RestApi.errorHandler = jasmine.createSpy('errorHandler').and.returnValue(new Promise(function (resolve, reject) {
                        resolve();
                    }));

                    // call & assert
                    RestApi.request(AR).then(function (response) {
                        expect(RestApi.responseHandler).not.toHaveBeenCalled();
                        expect(RestApi.errorHandler).toHaveBeenCalledWith("BBB");
                        done();
                    });
                });

                it("RestApi.request should (on error) call response_handler with response, if no error_handler is provided, and resolve only when responseHandler resolves", function (done) {

                    // prepare
                    RestApi.http = http_mock_reject;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};
                    RestApi.responseTransformer = function () {
                        return "BBB";
                    };

                    var AR = (function (_ActiveRecord12) {
                        _inherits(AR, _ActiveRecord12);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // spy
                        return AR;
                    })(ActiveRecord);

                    RestApi.responseHandler = jasmine.createSpy('responseHandler').and.returnValue(new Promise(function (resolve, reject) {
                        resolve();
                    }));

                    // call & assert
                    RestApi.request(AR).then(function (response) {
                        expect(RestApi.responseHandler).toHaveBeenCalledWith("BBB");
                        done();
                    });
                });

                it("RestApi.request should (on error) reject immediately with response if neither responseHandler nor error_handler are provided", function (done) {

                    // prepare
                    RestApi.http = http_mock_reject;
                    RestApi._headers = {};
                    RestApi._hostname = "AAA";
                    RestApi._path_generator = function () {};
                    RestApi.responseTransformer = function () {
                        return "BBB";
                    };

                    var AR = (function (_ActiveRecord13) {
                        _inherits(AR, _ActiveRecord13);

                        function AR() {
                            _classCallCheck(this, AR);

                            _get(Object.getPrototypeOf(AR.prototype), 'constructor', this).apply(this, arguments);
                        }

                        // call & assert
                        return AR;
                    })(ActiveRecord);

                    RestApi.request(AR).then(function (response) {}, function (response) {
                        expect(response).toEqual("BBB");
                        done();
                    });
                });

                //---------------------------------------------------
                // index
                //---------------------------------------------------

                it("RestApi.index should return the result of request", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    var r = RestApi.index(null);

                    // assert
                    expect(r).toEqual("BBB");
                });

                it("RestApi.index should set request_config.method to GET", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    RestApi.index("AAA");

                    // assert
                    var expected_config = {
                        method: "GET"
                    };
                    expect(RestApi.request).toHaveBeenCalledWith("AAA", expected_config);
                });

                //---------------------------------------------------
                // view
                //---------------------------------------------------

                it("RestApi.view should throw an error if id is not provided", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // assert
                    expect(RestApi.view).toThrowError(RestApi.MESSAGE_ID_IS_REQURIED);
                });

                it("RestApi.view should return the result of request", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    var r = RestApi.view(null, 111);

                    // assert
                    expect(r).toEqual("BBB");
                });

                it("RestApi.view should set request_config.method to GET & sub_path to id parameters", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    RestApi.view("AAA", 111);

                    // assert
                    var expected_config = {
                        method: "GET",
                        sub_path: 111
                    };
                    expect(RestApi.request).toHaveBeenCalledWith("AAA", expected_config);
                });

                //---------------------------------------------------
                // add
                //---------------------------------------------------

                it("RestApi.add should return the result of request", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    var r = RestApi.add(null);

                    // assert
                    expect(r).toEqual("BBB");
                });

                it("RestApi.add should set request_config.method to POST", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    RestApi.add("AAA");

                    // assert
                    var expected_config = {
                        method: "POST"
                    };
                    expect(RestApi.request).toHaveBeenCalledWith("AAA", expected_config);
                });

                //---------------------------------------------------
                // edit
                //---------------------------------------------------

                it("RestApi.edit should throw an error if id is not provided", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // assert
                    expect(RestApi.edit).toThrowError(RestApi.MESSAGE_ID_IS_REQURIED);
                });

                it("RestApi.edit should return the result of request", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    var r = RestApi.edit(null, 111);

                    // assert
                    expect(r).toEqual("BBB");
                });

                it("RestApi.edit should set request_config.method to PUT & sub_path to id parameters", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    RestApi.edit("AAA", 111);

                    // assert
                    var expected_config = {
                        method: "PUT",
                        sub_path: 111
                    };
                    expect(RestApi.request).toHaveBeenCalledWith("AAA", expected_config);
                });

                //---------------------------------------------------
                // delete
                //---------------------------------------------------

                it("RestApi.delete should throw an error if id is not provided", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // assert
                    expect(RestApi['delete']).toThrowError(RestApi.MESSAGE_ID_IS_REQURIED);
                });

                it("RestApi.delete should return the result of request", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    var r = RestApi['delete'](null, 111);

                    // assert
                    expect(r).toEqual("BBB");
                });

                it("RestApi.delete should set request_config.method to PUT & sub_path to id parameters", function () {

                    // spies
                    spyOn(RestApi, "request").and.returnValue("BBB");

                    // call
                    RestApi['delete']("AAA", 111);

                    // assert
                    var expected_config = {
                        method: "DELETE",
                        sub_path: 111
                    };
                    expect(RestApi.request).toHaveBeenCalledWith("AAA", expected_config);
                });
            });
        }
    };
});