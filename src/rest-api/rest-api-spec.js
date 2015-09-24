import { ActiveRecord, BaseModel, RestApi } from '../angular-cakephp';

var http_mock = () => {
    return new Promise( ( resolve, reject ) => {
        resolve( {} );
    } );
};

describe( "RestApi", () => {

    beforeEach( () => {
        RestApi.reset();
    });

    //---------------------------------------------------
    // pathGenerator
    //---------------------------------------------------

    it("RestApi.path should be the result of RestApi.pathGenerator (which is passed the _.snakeCase of active_record_class name)", () => {

        // prepare
        class AR extends ActiveRecord {}
        RestApi._active_record_class = AR;
        RestApi.pathGenerator = ( active_record_class_name ) => {
            return active_record_class_name;
        };

        // call
        let r = RestApi.path;

        // assert
        expect( r ).toEqual( "ar" );
    });

    //---------------------------------------------------
    // url
    //---------------------------------------------------

    it("get RestApi.url should throw an error if url is null & hostname are not set", () => {

        RestApi.url = null;
        RestApi.hostname = null;
        RestApi.path = "AAA";

        try {
            let r = RestApi.url;
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });

    it("get RestApi.url should throw an error if url is null & path are not set", () => {

        RestApi.url = null;
        RestApi.hostname = "AAA";
        RestApi.path = null;

        try {
            let r = RestApi.url;
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });

    it("get RestApi.url should return combination of RestApi.hostname & RestApi.path", () => {

        RestApi.url = null;
        RestApi.hostname = "AAA";
        RestApi.path = "BBB";

        // call
        let r = RestApi.url;

        // assert
        expect( r ).toEqual( "AAABBB" );
    });

    //----------------------------------------------------
    // request
    //----------------------------------------------------

    //---------------------------
    // exceptions
    //---------------------------

    it("RestApi.request should throw an error if http is not set", () => {

        // prepare
        RestApi.http = null;

        // call & assert

        try {
            let r = RestApi.request();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HTTP_REQUIRED );

        // TODO: not working because scope is lost
        // expect( RestApi.request ).toThrowError( RestApi.MESSAGE_HTTP_REQUIRED );
        expect("AAA").toEqual("AAA");
    });

    //---------------------------
    // class property updates
    //---------------------------

    it("RestApi.request should set RestApi.activeRecordClass if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.request( {}, "BBB" );

        // assert
        expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    });

    it("RestApi.request should set RestApi.responseTransformer if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.request( {}, null, "BBB" );

        // assert
        expect( RestApi.responseTransformer ).toEqual( "BBB" );
    });

    it("RestApi.request should set RestApi.errorHandler if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.request( {}, null, null, "BBB" );

        // assert
        expect( RestApi.errorHandler ).toEqual( "BBB" );
    });

    it("RestApi.request should set RestApi.hostname if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.request( {'hostname': "BBB"} );

        // assert
        expect( RestApi.hostname ).toEqual( "BBB" );
    });

    it("RestApi.request should remove hostname from config", () => {

        // spy
        RestApi.http = http_mock;
        spyOn(RestApi, 'http').and.returnValue( http_mock() );

        // prepare
        RestApi.url = "AAA";

        // call
        RestApi.request( { 'hostname': "BBB" } );

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( { 'url': "AAA" } );
    });

    it("RestApi.request should set RestApi.path if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.request( {'path': "BBB"} );

        // assert
        expect( RestApi.path ).toEqual( "BBB" );
    });

    it("RestApi.request should remove path from config", () => {

        // spy
        RestApi.http = http_mock;
        spyOn(RestApi, 'http').and.returnValue( http_mock() );

        // prepare
        RestApi.url = "AAA";

        // call
        RestApi.request( { 'path': "BBB" } );

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( { 'url': "AAA" } );
    });

    //---------------------------
    // config param updates
    //---------------------------

    it("RestApi.request should add RestApi.paramSerializer & RestApi.url if set", () => {

        // spy
        RestApi.http = http_mock;
        spyOn(RestApi, 'http').and.returnValue( http_mock() );

        // prepare
        RestApi.paramSerializer = "AAA";
        RestApi.url = "BBB";

        // call
        RestApi.request( { 'a': "A" } );

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( { 'a': "A", 'paramSerializer': "AAA", 'url': "BBB" } );
    });

    it("RestApi.request should add config.sub_path to config.url if set, and remove sub_path from config", () => {

        // spy
        RestApi.http = http_mock;
        spyOn(RestApi, 'http').and.returnValue( http_mock() );

        // prepare
        RestApi.paramSerializer = "AAA";
        RestApi.url = "BBB";

        // call
        RestApi.request( { 'a': "A", 'sub_path': "CCC" } );

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( { 'a': "A", 'paramSerializer': "AAA", 'url': "BBB/CCC" } );
    });

    //---------------------------
    // Promise
    //---------------------------

    it("RestApi.request should return a promise", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        var p = RestApi.request();

        // assert
        expect( p.then ).toBeDefined();
    });

    it("RestApi.request should call http with provided config", () => {

        // spy
        RestApi.http = http_mock;
        spyOn(RestApi, 'http').and.returnValue( http_mock() );

        // prepare
        RestApi.url = "AAA";

        // call
        RestApi.request( { 'a': "A" } );

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( { 'a': "A", 'url': "AAA" } );
    });

    // ASYNC test
    it("RestApi.request should (on pass) call response transformer (if provided) with http result & active record class", ( done ) => {

        // spy
        let responseTransformer = jasmine.createSpy('responseTransformer');

        // prepare
        RestApi.http = () => {
            return new Promise( ( resolve, reject ) => {
                resolve( "AAA" );
            } );
        };
        RestApi.activeRecordClass = "BBB";
        RestApi.url = "CCC";

        // prepare assert
        let assert = ( state, response ) => {
            expect( state ).toEqual( "PASS" );
            expect( responseTransformer ).toHaveBeenCalledWith( "AAA", "BBB" );
            done();
        };

        // call
        RestApi.request( {}, null, responseTransformer ).then(
            ( response ) => { assert( "PASS", response ); },
            ( response ) => { assert( "FAIL", response ); }
        );
    });

    // ASYNC test
    it("RestApi.request should call error handler with http result (on fail) if provided", ( done ) => {

        // spy
        let errorHandler = jasmine.createSpy('errorHandler');

        // prepare
        RestApi.http = () => {
            return new Promise( ( resolve, reject ) => {
                reject( "AAA" );
            } );
        };
        RestApi.url = "BBB";

        // prepare assert
        let assert = ( state, response ) => {
            expect( state ).toEqual( "FAIL" );
            expect( errorHandler ).toHaveBeenCalledWith( "AAA" );
            done();
        };

        // call
        RestApi.request( {}, null, null, errorHandler ).then(
            ( response ) => { assert( "PASS", response ); },
            ( response ) => { assert( "FAIL", response ); }
        );
    });

    //---------------------------------------------------
    // index
    //---------------------------------------------------

    //---------------------------
    // exceptions
    //---------------------------

    it("RestApi.index should throw an error if url is not set", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.hostname = null;
        RestApi.path = null;
        RestApi.url = null;

        // call & assert

        try {
            let r = RestApi.index();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );

        // TODO: not working because scope is lost
        // expect( RestApi.index ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });

    //---------------------------
    // class property updates
    //---------------------------

    it("RestApi.index should set RestApi.activeRecordClass if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.index( {}, "BBB" );

        // assert
        expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    });

    //---------------------------
    // config param updates
    //---------------------------

    it("RestApi.index should call RestApi.request with updated config", () => {

        // spy
        spyOn( RestApi, 'request' );

        // prepare
        RestApi.url = "AAA";
        RestApi.headers = "BBB";

        // call
        RestApi.index( {} );

        // assert
        let _expected = { 'method': "GET", 'url': "AAA", 'headers': "BBB" };
        expect( RestApi.request ).toHaveBeenCalledWith( _expected );
    });

    //---------------------------
    // Promise
    //---------------------------

    it("RestApi.index should return a promise", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        var p = RestApi.index( {} );

        // assert
        expect( p.then ).toBeDefined();
    });

    //---------------------------------------------------
    // view
    //---------------------------------------------------

    //---------------------------
    // exceptions
    //---------------------------

    it("RestApi.view should throw an error if id is not provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.hostname = null;
        RestApi.path = null;
        RestApi.url = null;

        // call & assert

        try {
            let r = RestApi.view();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_ID_IS_REQURIED );

        // TODO: not working because scope is lost
        // expect( () => { RestApi.view(); } ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    });

    it("RestApi.view should throw an error if url is not set", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.hostname = null;
        RestApi.path = null;
        RestApi.url = null;

        // call & assert

        try {
            let r = RestApi.view( 123 );
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );

        // TODO: not working because can't pass function to expect
        // expect( () => { RestApi.view( 123 ); } ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });

    //---------------------------
    // class property updates
    //---------------------------

    it("RestApi.view should set RestApi.activeRecordClass if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.view( 123, {}, "BBB" );

        // assert
        expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    });

    //---------------------------
    // config param updates
    //---------------------------

    it("RestApi.view should call RestApi.request with updated config", () => {

        // spy
        spyOn(RestApi, 'request');

        // prepare
        RestApi.url = "AAA";
        RestApi.headers = "BBB";

        // call
        RestApi.view( 123, {} );

        // assert
        let _expected = { 'method': "GET", 'url': "AAA/123", 'headers': "BBB" };
        expect( RestApi.request ).toHaveBeenCalledWith( _expected );
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

    it("RestApi.view should return a promise", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        var p = RestApi.view( 123, {} );

        // assert
        expect( p.then ).toBeDefined();
    });

    //---------------------------------------------------
    // add
    //---------------------------------------------------

    //---------------------------
    // exceptions
    //---------------------------

    it("RestApi.add should throw an error if url is not set", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.hostname = null;
        RestApi.path = null;
        RestApi.url = null;

        // call & assert

        try {
            let r = RestApi.add();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );

        // TODO: not working because scope is lost
        // expect( RestApi.add ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });

    //---------------------------
    // class property updates
    //---------------------------

    it("RestApi.add should set RestApi.activeRecordClass if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.add( {}, {}, "BBB" );

        // assert
        expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    });

    //---------------------------
    // config param updates
    //---------------------------

    it("RestApi.add should call RestApi.request with updated config", () => {

        // spy
        spyOn(RestApi, 'request');

        // prepare
        RestApi.url = "AAA";
        RestApi.headers = "BBB";

        // call
        RestApi.add( {}, { 'a': "A" } );

        // assert
        let _expected = { 'method': "POST", 'url': "AAA", 'data': { 'a': "A" }, 'headers': "BBB" };
        expect( RestApi.request ).toHaveBeenCalledWith( _expected );
    });

    //---------------------------
    // Promise
    //---------------------------

    it("RestApi.add should return a promise", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        var p = RestApi.add( {} );

        // assert
        expect( p.then ).toBeDefined();
    });

    //---------------------------------------------------
    // edit
    //---------------------------------------------------

    //---------------------------
    // exceptions
    //---------------------------

    it("RestApi.edit should throw an error if id is not provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.hostname = null;
        RestApi.path = null;
        RestApi.url = null;

        // call & assert

        try {
            let r = RestApi.edit();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_ID_IS_REQURIED );

        // TODO: not working because scope is lost
        // expect( RestApi.edit ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    });

    it("RestApi.edit should throw an error if url is not set", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.hostname = null;
        RestApi.path = null;
        RestApi.url = null;

        // call & assert

        try {
            let r = RestApi.edit( 123 );
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );

        // TODO: not working because can't pass function to expect
        // expect( () => { RestApi.edit( 123 ); } ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });

    //---------------------------
    // class property updates
    //---------------------------

    it("RestApi.edit should set RestApi.activeRecordClass if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.edit( 123, {}, {}, "BBB" );

        // assert
        expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    });

    //---------------------------
    // config param updates
    //---------------------------

    it("RestApi.edit should call RestApi.request with updated config", () => {

        // spy
        spyOn(RestApi, 'request');

        // prepare
        RestApi.url = "AAA";
        RestApi.headers = "BBB";

        // call
        RestApi.edit( 123, {}, { 'a': "A" } );

        // assert
        let _expected = { 'method': "PUT", 'url': "AAA/123", 'data': { 'a': "A" }, 'headers': "BBB" };
        expect( RestApi.request ).toHaveBeenCalledWith( _expected );
    });

    //---------------------------
    // Promise
    //---------------------------

    it("RestApi.edit should return a promise", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        var p = RestApi.edit( 123, {} );

        // assert
        expect( p.then ).toBeDefined();
    });

    //---------------------------------------------------
    // delete
    //---------------------------------------------------

    //---------------------------
    // exceptions
    //---------------------------

    it("RestApi.delete should throw an error if id is not provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call & assert

        try {
            let r = RestApi.delete();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_ID_IS_REQURIED );

        // TODO: not working because scope is lost
        // expect( RestApi.delete ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    });

    it("RestApi.delete should throw an error if url is not set", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = null;
        RestApi.hostname = null;
        RestApi.path = null;

        // call & assert

        try {
            let r = RestApi.delete( 123 );
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );

        // TODO: not working because scope is lost
        // expect( RestApi.delete ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });


    //---------------------------
    // class property updates
    //---------------------------

    it("RestApi.delete should set RestApi.activeRecordClass if a value is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        RestApi.delete( 123, {}, "BBB" );

        // assert
        expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    });

    //---------------------------
    // config param updates
    //---------------------------

    it("RestApi.delete should call RestApi.request with updated config", () => {

        // spy
        spyOn(RestApi, 'request');

        // prepare
        RestApi.url = "AAA";
        RestApi.headers = "BBB";

        // call
        RestApi.delete( 123, {} );

        // assert
        let _expected = { 'method': "DELETE", 'url': "AAA/123", 'headers': "BBB" };
        expect( RestApi.request ).toHaveBeenCalledWith( _expected );
    });

    //---------------------------
    // Promise
    //---------------------------

    it("RestApi.edit should return a promise", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi.url = "AAA";

        // call
        var p = RestApi.edit( 123, {} );

        // assert
        expect( p.then ).toBeDefined();
    });
});
