System.register(["../angular-cakephp"], function (_export) {
    "use strict";

    var ActiveRecord, BaseModel, RestApi, http_mock;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

            describe("RestApi", function () {

                beforeEach(function () {
                    RestApi.reset();
                });

                //---------------------------------------------------
                // pathGenerator
                //---------------------------------------------------

                it("RestApi.path should be the result of RestApi.pathGenerator (which is passed the _.snakeCase of active_record_class name)", function () {

                    // prepare

                    var AR = function AR() {
                        _classCallCheck(this, AR);
                    };

                    RestApi._active_record_class = AR;
                    RestApi.pathGenerator = function (active_record_class_name) {
                        return active_record_class_name;
                    };

                    // call
                    var r = RestApi.path;

                    // assert
                    expect(r).toEqual("ar");
                });

                //---------------------------------------------------
                // url
                //---------------------------------------------------

                it("get RestApi.url should throw an error if url is null & hostname are not set", function () {

                    RestApi.url = null;
                    RestApi.hostname = null;
                    RestApi.path = "AAA";

                    try {
                        var r = RestApi.url;
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);
                });

                it("get RestApi.url should throw an error if url is null & path are not set", function () {

                    RestApi.url = null;
                    RestApi.hostname = "AAA";
                    RestApi.path = null;

                    try {
                        var r = RestApi.url;
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);
                });

                it("get RestApi.url should return combination of RestApi.hostname & RestApi.path", function () {

                    RestApi.url = null;
                    RestApi.hostname = "AAA";
                    RestApi.path = "BBB";

                    // call
                    var r = RestApi.url;

                    // assert
                    expect(r).toEqual("AAABBB");
                });

                //----------------------------------------------------
                // request
                //----------------------------------------------------

                //---------------------------
                // exceptions
                //---------------------------

                it("RestApi.request should throw an error if http is not set", function () {

                    // prepare
                    RestApi.http = null;

                    // call & assert

                    try {
                        var r = RestApi.request();
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_HTTP_REQUIRED);

                    // TODO: not working because scope is lost
                    // expect( RestApi.request ).toThrowError( RestApi.MESSAGE_HTTP_REQUIRED );
                    expect("AAA").toEqual("AAA");
                });

                //---------------------------
                // class property updates
                //---------------------------

                it("RestApi.request should set RestApi.activeRecordClass if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.request({}, "BBB");

                    // assert
                    expect(RestApi.activeRecordClass).toEqual("BBB");
                });

                it("RestApi.request should set RestApi.responseTransformer if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.request({}, null, "BBB");

                    // assert
                    expect(RestApi.responseTransformer).toEqual("BBB");
                });

                it("RestApi.request should set RestApi.errorHandler if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.request({}, null, null, "BBB");

                    // assert
                    expect(RestApi.errorHandler).toEqual("BBB");
                });

                it("RestApi.request should set RestApi.hostname if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.request({ 'hostname': "BBB" });

                    // assert
                    expect(RestApi.hostname).toEqual("BBB");
                });

                it("RestApi.request should remove hostname from config", function () {

                    // spy
                    RestApi.http = http_mock;
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // prepare
                    RestApi.url = "AAA";

                    // call
                    RestApi.request({ 'hostname': "BBB" });

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith({ 'url': "AAA" });
                });

                it("RestApi.request should set RestApi.path if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.request({ 'path': "BBB" });

                    // assert
                    expect(RestApi.path).toEqual("BBB");
                });

                it("RestApi.request should remove path from config", function () {

                    // spy
                    RestApi.http = http_mock;
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // prepare
                    RestApi.url = "AAA";

                    // call
                    RestApi.request({ 'path': "BBB" });

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith({ 'url': "AAA" });
                });

                //---------------------------
                // config param updates
                //---------------------------

                it("RestApi.request should add RestApi.paramSerializer & RestApi.url if set", function () {

                    // spy
                    RestApi.http = http_mock;
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // prepare
                    RestApi.paramSerializer = "AAA";
                    RestApi.url = "BBB";

                    // call
                    RestApi.request({ 'a': "A" });

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith({ 'a': "A", 'paramSerializer': "AAA", 'url': "BBB" });
                });

                it("RestApi.request should add config.sub_path to config.url if set, and remove sub_path from config", function () {

                    // spy
                    RestApi.http = http_mock;
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // prepare
                    RestApi.paramSerializer = "AAA";
                    RestApi.url = "BBB";

                    // call
                    RestApi.request({ 'a': "A", 'sub_path': "CCC" });

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith({ 'a': "A", 'paramSerializer': "AAA", 'url': "BBB/CCC" });
                });

                //---------------------------
                // Promise
                //---------------------------

                it("RestApi.request should return a promise", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    var p = RestApi.request();

                    // assert
                    expect(p.then).toBeDefined();
                });

                it("RestApi.request should call http with provided config", function () {

                    // spy
                    RestApi.http = http_mock;
                    spyOn(RestApi, 'http').and.returnValue(http_mock());

                    // prepare
                    RestApi.url = "AAA";

                    // call
                    RestApi.request({ 'a': "A" });

                    // assert
                    expect(RestApi.http).toHaveBeenCalledWith({ 'a': "A", 'url': "AAA" });
                });

                // ASYNC test
                it("RestApi.request should (on pass) call response transformer (if provided) with http result & active record class", function (done) {

                    // spy
                    var responseTransformer = jasmine.createSpy('responseTransformer');

                    // prepare
                    RestApi.http = function () {
                        return new Promise(function (resolve, reject) {
                            resolve("AAA");
                        });
                    };
                    RestApi.activeRecordClass = "BBB";
                    RestApi.url = "CCC";

                    // prepare assert
                    var assert = function assert(state, response) {
                        expect(state).toEqual("PASS");
                        expect(responseTransformer).toHaveBeenCalledWith("AAA", "BBB");
                        done();
                    };

                    // call
                    RestApi.request({}, null, responseTransformer).then(function (response) {
                        assert("PASS", response);
                    }, function (response) {
                        assert("FAIL", response);
                    });
                });

                // ASYNC test
                it("RestApi.request should call error handler with http result (on fail) if provided", function (done) {

                    // spy
                    var errorHandler = jasmine.createSpy('errorHandler');

                    // prepare
                    RestApi.http = function () {
                        return new Promise(function (resolve, reject) {
                            reject("AAA");
                        });
                    };
                    RestApi.url = "BBB";

                    // prepare assert
                    var assert = function assert(state, response) {
                        expect(state).toEqual("FAIL");
                        expect(errorHandler).toHaveBeenCalledWith("AAA");
                        done();
                    };

                    // call
                    RestApi.request({}, null, null, errorHandler).then(function (response) {
                        assert("PASS", response);
                    }, function (response) {
                        assert("FAIL", response);
                    });
                });

                //---------------------------------------------------
                // index
                //---------------------------------------------------

                //---------------------------
                // exceptions
                //---------------------------

                it("RestApi.index should throw an error if url is not set", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.hostname = null;
                    RestApi.path = null;
                    RestApi.url = null;

                    // call & assert

                    try {
                        var r = RestApi.index();
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);

                    // TODO: not working because scope is lost
                    // expect( RestApi.index ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
                });

                //---------------------------
                // class property updates
                //---------------------------

                it("RestApi.index should set RestApi.activeRecordClass if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.index({}, "BBB");

                    // assert
                    expect(RestApi.activeRecordClass).toEqual("BBB");
                });

                //---------------------------
                // config param updates
                //---------------------------

                it("RestApi.index should call RestApi.request with updated config", function () {

                    // spy
                    spyOn(RestApi, 'request');

                    // prepare
                    RestApi.url = "AAA";
                    RestApi.headers = "BBB";

                    // call
                    RestApi.index({});

                    // assert
                    var _expected = { 'method': "GET", 'url': "AAA", 'headers': "BBB" };
                    expect(RestApi.request).toHaveBeenCalledWith(_expected);
                });

                //---------------------------
                // Promise
                //---------------------------

                it("RestApi.index should return a promise", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    var p = RestApi.index({});

                    // assert
                    expect(p.then).toBeDefined();
                });

                //---------------------------------------------------
                // view
                //---------------------------------------------------

                //---------------------------
                // exceptions
                //---------------------------

                it("RestApi.view should throw an error if id is not provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.hostname = null;
                    RestApi.path = null;
                    RestApi.url = null;

                    // call & assert

                    try {
                        var r = RestApi.view();
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_ID_IS_REQURIED);

                    // TODO: not working because scope is lost
                    // expect( () => { RestApi.view(); } ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
                });

                it("RestApi.view should throw an error if url is not set", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.hostname = null;
                    RestApi.path = null;
                    RestApi.url = null;

                    // call & assert

                    try {
                        var r = RestApi.view(123);
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);

                    // TODO: not working because can't pass function to expect
                    // expect( () => { RestApi.view( 123 ); } ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
                });

                //---------------------------
                // class property updates
                //---------------------------

                it("RestApi.view should set RestApi.activeRecordClass if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.view(123, {}, "BBB");

                    // assert
                    expect(RestApi.activeRecordClass).toEqual("BBB");
                });

                //---------------------------
                // config param updates
                //---------------------------

                it("RestApi.view should call RestApi.request with updated config", function () {

                    // spy
                    spyOn(RestApi, 'request');

                    // prepare
                    RestApi.url = "AAA";
                    RestApi.headers = "BBB";

                    // call
                    RestApi.view(123, {});

                    // assert
                    var _expected = { 'method': "GET", 'url': "AAA/123", 'headers': "BBB" };
                    expect(RestApi.request).toHaveBeenCalledWith(_expected);
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                it("description", function () {
                    expect("A").toEqual("A");
                });

                //---------------------------
                // Promise
                //---------------------------

                it("RestApi.view should return a promise", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    var p = RestApi.view(123, {});

                    // assert
                    expect(p.then).toBeDefined();
                });

                //---------------------------------------------------
                // add
                //---------------------------------------------------

                //---------------------------
                // exceptions
                //---------------------------

                it("RestApi.add should throw an error if url is not set", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.hostname = null;
                    RestApi.path = null;
                    RestApi.url = null;

                    // call & assert

                    try {
                        var r = RestApi.add();
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);

                    // TODO: not working because scope is lost
                    // expect( RestApi.add ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
                });

                //---------------------------
                // class property updates
                //---------------------------

                it("RestApi.add should set RestApi.activeRecordClass if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.add({}, {}, "BBB");

                    // assert
                    expect(RestApi.activeRecordClass).toEqual("BBB");
                });

                //---------------------------
                // config param updates
                //---------------------------

                it("RestApi.add should call RestApi.request with updated config", function () {

                    // spy
                    spyOn(RestApi, 'request');

                    // prepare
                    RestApi.url = "AAA";
                    RestApi.headers = "BBB";

                    // call
                    RestApi.add({}, { 'a': "A" });

                    // assert
                    var _expected = { 'method': "POST", 'url': "AAA", 'data': { 'a': "A" }, 'headers': "BBB" };
                    expect(RestApi.request).toHaveBeenCalledWith(_expected);
                });

                //---------------------------
                // Promise
                //---------------------------

                it("RestApi.add should return a promise", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    var p = RestApi.add({});

                    // assert
                    expect(p.then).toBeDefined();
                });

                //---------------------------------------------------
                // edit
                //---------------------------------------------------

                //---------------------------
                // exceptions
                //---------------------------

                it("RestApi.edit should throw an error if id is not provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.hostname = null;
                    RestApi.path = null;
                    RestApi.url = null;

                    // call & assert

                    try {
                        var r = RestApi.edit();
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_ID_IS_REQURIED);

                    // TODO: not working because scope is lost
                    // expect( RestApi.edit ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
                });

                it("RestApi.edit should throw an error if url is not set", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.hostname = null;
                    RestApi.path = null;
                    RestApi.url = null;

                    // call & assert

                    try {
                        var r = RestApi.edit(123);
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);

                    // TODO: not working because can't pass function to expect
                    // expect( () => { RestApi.edit( 123 ); } ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
                });

                //---------------------------
                // class property updates
                //---------------------------

                it("RestApi.edit should set RestApi.activeRecordClass if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi.edit(123, {}, {}, "BBB");

                    // assert
                    expect(RestApi.activeRecordClass).toEqual("BBB");
                });

                //---------------------------
                // config param updates
                //---------------------------

                it("RestApi.edit should call RestApi.request with updated config", function () {

                    // spy
                    spyOn(RestApi, 'request');

                    // prepare
                    RestApi.url = "AAA";
                    RestApi.headers = "BBB";

                    // call
                    RestApi.edit(123, {}, { 'a': "A" });

                    // assert
                    var _expected = { 'method': "PUT", 'url': "AAA/123", 'data': { 'a': "A" }, 'headers': "BBB" };
                    expect(RestApi.request).toHaveBeenCalledWith(_expected);
                });

                //---------------------------
                // Promise
                //---------------------------

                it("RestApi.edit should return a promise", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    var p = RestApi.edit(123, {});

                    // assert
                    expect(p.then).toBeDefined();
                });

                //---------------------------------------------------
                // delete
                //---------------------------------------------------

                //---------------------------
                // exceptions
                //---------------------------

                it("RestApi.delete should throw an error if id is not provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call & assert

                    try {
                        var r = RestApi["delete"]();
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_ID_IS_REQURIED);

                    // TODO: not working because scope is lost
                    // expect( RestApi.delete ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
                });

                it("RestApi.delete should throw an error if url is not set", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = null;
                    RestApi.hostname = null;
                    RestApi.path = null;

                    // call & assert

                    try {
                        var r = RestApi["delete"](123);
                    } catch (error) {
                        var error_message = error.message;
                    }
                    expect(error_message).toEqual(RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED);

                    // TODO: not working because scope is lost
                    // expect( RestApi.delete ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
                });

                //---------------------------
                // class property updates
                //---------------------------

                it("RestApi.delete should set RestApi.activeRecordClass if a value is provided", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    RestApi["delete"](123, {}, "BBB");

                    // assert
                    expect(RestApi.activeRecordClass).toEqual("BBB");
                });

                //---------------------------
                // config param updates
                //---------------------------

                it("RestApi.delete should call RestApi.request with updated config", function () {

                    // spy
                    spyOn(RestApi, 'request');

                    // prepare
                    RestApi.url = "AAA";
                    RestApi.headers = "BBB";

                    // call
                    RestApi["delete"](123, {});

                    // assert
                    var _expected = { 'method': "DELETE", 'url': "AAA/123", 'headers': "BBB" };
                    expect(RestApi.request).toHaveBeenCalledWith(_expected);
                });

                //---------------------------
                // Promise
                //---------------------------

                it("RestApi.edit should return a promise", function () {

                    // prepare
                    RestApi.http = http_mock;
                    RestApi.url = "AAA";

                    // call
                    var p = RestApi.edit(123, {});

                    // assert
                    expect(p.then).toBeDefined();
                });
            });
        }
    };
});