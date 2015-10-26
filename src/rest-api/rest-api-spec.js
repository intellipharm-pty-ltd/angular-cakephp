import { ActiveRecord, BaseModel, RestApi } from '../angular-cakephp';

var http_mock = () => {
    return new Promise( ( resolve, reject ) => {
        resolve( {} );
    } );
};
var http_mock_reject = () => {
    return new Promise( ( resolve, reject ) => {
        reject( {} );
    } );
};

describe( 'RestApi', () => {

    beforeEach( () => {
        RestApi.reset();
    });

    //---------------------------------------------------
    // pathGenerator
    //---------------------------------------------------

    it("RestApi.path() should call RestApi.pathGenerator with the _.snakeCase of active_record_class name", () => {

        // spy
        RestApi.pathGenerator = jasmine.createSpy('pathGenerator');

        // prepare
        class AR extends ActiveRecord {}

        // call
        let r = RestApi.path( AR );

        // assert
        expect( RestApi.pathGenerator ).toHaveBeenCalledWith( 'ar' );
    });

    //---------------------------------------------------
    // path
    //---------------------------------------------------

    it("Given a Class: RestApi.path() should call RestApi.pathGenerator with the active_record_class class's name, and return the result", () => {

        // spy
        RestApi.pathGenerator = jasmine.createSpy('pathGenerator').and.returnValue( "AAA" );

        // prepare
        class AR extends ActiveRecord {}

        // call
        let r = RestApi.path( AR );

        // assert
        expect( RestApi.pathGenerator ).toHaveBeenCalledWith( 'ar' );
        expect( r ).toEqual( "AAA" );
    });

    it("Given a Function: RestApi.path() should call RestApi.pathGenerator with the active_record_class function's name, and return the result", () => {

        // spy
        RestApi.pathGenerator = jasmine.createSpy( 'pathGenerator' ).and.returnValue( "AAA" );

        // prepare
        let AR = function() {};

        // call
        let r = RestApi.path( AR );

        // assert
        expect( RestApi.pathGenerator ).toHaveBeenCalledWith( 'ar' );
        expect( r ).toEqual( "AAA" );
    });

    //---------------------------------------------------
    // url
    //---------------------------------------------------

    it("RestApi.url() should url if already set and if both active_record_class & config.path are not provided", () => {

        // prepare
        RestApi._url = "AAA";

        // call
        let r = RestApi.url();

        // assert
        expect( r ).toEqual( "AAA" );
    });

    it("get RestApi.url should throw an error if hostname is not set and is not provided via config.hostname", () => {

        RestApi._hostname = null;
        RestApi._path = "AAA";

        try {
            let r = RestApi.url();
        } catch ( error ) {
            var error_message = error.message;
        }

        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });

    it("get RestApi.url should throw an error if hostname is not set and is not provided via config.hostname", () => {

        RestApi._hostname = "AAA";
        RestApi._path = null;

        try {
            let r = RestApi.url();
        } catch ( error ) {
            var error_message = error.message;
        }

        expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    });

    it("get RestApi.url should return combination of RestApi.hostname & RestApi.path", () => {

        RestApi._hostname = "AAA";
        RestApi._path = "BBB";

        // call
        let r = RestApi.url();

        // assert
        expect( r ).toEqual( "AAABBB" );
    });

    //----------------------------------------------------
    // request
    //----------------------------------------------------

    //----------------------------------------------------
    // request :: exceptions
    //----------------------------------------------------

    it("RestApi.request should throw an error if http is not set", () => {

        // prepare
        RestApi._http = null;

        // call & assert
        expect( RestApi.request ).toThrowError( RestApi.MESSAGE_HTTP_REQUIRED );
    });

    //----------------------------------------------------
    // request :: no ActiveRecord
    //----------------------------------------------------

    it("RestApi.request should return object if no ActiveRecord is set", ( done ) => {

        // prepare
        let responseTransformer = jasmine.createSpy('responseTransformer').and.returnValue(
            new Promise( ( resolve, reject ) => {
                resolve( "DDD" );
            } )
        );
        let responseHandler = jasmine.createSpy('responseHandler').and.returnValue(
            new Promise( ( resolve, reject ) => {
                resolve( "CCC" );
            } )
        );
        RestApi.http = http_mock;
        RestApi.hostname = "AAA";
        RestApi.responseTransformer = responseTransformer;
        RestApi.responseHandler = responseHandler;

        // spies
        spyOn(RestApi, 'http').and.returnValue( http_mock() );

        // prepare assert
        let assert = ( state, response ) => {
            expect( state ).toEqual( "PASS" );
            done();
        };

        // call
        RestApi.request( null, { path: "BBB" } ).then(
            ( response ) => { assert( "PASS", response ); },
            ( response ) => { assert( "FAIL", response ); }
        );
    });

    //----------------------------------------------------
    // request :: args
    //----------------------------------------------------

    it("RestApi.request should ???? if a active_record_class is provided", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi._hostname = "AAA";
        RestApi._path = "AAA";
        class AR extends ActiveRecord {}

        // call
        RestApi.request( AR );

        // assert
        // expect( ????? ).toEqual( ????? );
    });

    //----------------------------------------------------
    // request :: config param updates
    //----------------------------------------------------

    //---------------------------
    // headers
    //---------------------------

    it("RestApi.request should add headers request config", () => {

        // prepare
        RestApi.http                = http_mock;
        RestApi._hostname           = "AAA";
        RestApi._path               = "BBB";
        RestApi._headers            = { a: "A" };

        // spy
        spyOn( RestApi, 'http' ).and.returnValue( http_mock() );

        // call
        RestApi.request();

        let expected_result = {
            headers: { a: "A" },
            url: "AAABBB"
        };

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( expected_result );
    });

    it("if config.headers is provided, then RestApi.request should set request config by merging config.headers and RestApi.headers, with config.headers taking priority", () => {

        // prepare
        RestApi.http                = http_mock;
        RestApi._hostname           = "AAA";
        RestApi._path               = "BBB";
        RestApi._headers            = { a: "A", c: "C1" };

        // spy
        spyOn( RestApi, 'http' ).and.returnValue( http_mock() );

        // call
        RestApi.request( null, { "headers": { b: "B", c: "C2" } } );

        let expected_result = {
            headers: { a: "A", c: "C2", b: "B" },
            url: "AAABBB"
        };

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( expected_result );
    });

    //---------------------------
    // paramSerializer
    //---------------------------

    it("if paramSerializer is set, then RestApi.request should add it to request config", () => {

        // prepare
        RestApi.http                = http_mock;
        RestApi._hostname           = "AAA";
        RestApi._path               = "BBB";
        RestApi._headers            = {};

        RestApi._param_serializer   = "CCC";

        // spy
        spyOn( RestApi, 'http' ).and.returnValue( http_mock() );

        // call
        RestApi.request();

        let expected_result = {
            "headers": {},
            "paramSerializer": "CCC",
            "url": "AAABBB"
        };

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( expected_result );
    });

    it("if config.paramSerializer is provided, then RestApi.request should add config.paramSerializer to request config", () => {

        // prepare
        RestApi.http                = http_mock;
        RestApi._hostname           = "AAA";
        RestApi._path               = "BBB";
        RestApi._headers            = {};

        RestApi._param_serializer   = "CCC";

        // spy
        spyOn( RestApi, 'http' ).and.returnValue( http_mock() );

        // call
        RestApi.request( null, { paramSerializer: "DDD" } );

        let expected_result = {
            "headers": {},
            "paramSerializer": "DDD",
            "url": "AAABBB"
        };

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( expected_result );
    });

    //---------------------------
    // url
    //---------------------------

    it("if url is set, then RestApi.request should add it to request config, instead of concat'ing hostname & path", () => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};

        RestApi._url        = "CCC";

        // spy
        spyOn( RestApi, 'http' ).and.returnValue( http_mock() );

        // call
        RestApi.request();

        let expected_result = {
            "headers": {},
            "url": "CCC"
        };

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( expected_result );
    });

    it("if config.url is provided, then RestApi.request should add config.paramSerializer to request config", () => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};

        RestApi._url        = "CCC";

        // spy
        spyOn( RestApi, 'http' ).and.returnValue( http_mock() );

        // call
        RestApi.request( null, { url: "DDD" } );

        let expected_result = {
            "headers": {},
            "url": "DDD"
        };

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( expected_result );
    });

    //---------------------------
    // sub_path
    //---------------------------

    it("RestApi.request should append config.sub_path to config.url if set, and remove sub_path from config", () => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};
        RestApi._url        = "CCC";

        // spy
        spyOn( RestApi, 'http' ).and.returnValue( http_mock() );

        // call
        RestApi.request( null, { sub_path: "DDD" } );

        let expected_result = {
            "headers": {},
            "url": "CCC/DDD"
        };

        // assert
        expect( RestApi.http ).toHaveBeenCalledWith( expected_result );
    });

    //---------------------------
    // Promise
    //---------------------------

    it("RestApi.request should return a promise", () => {

        // prepare
        RestApi.http = http_mock;
        RestApi._url = "AAA";

        // call
        var p = RestApi.request();

        // assert
        expect( p.then ).toBeDefined();
    });

    //---------------------------
    // HTTP Service
    //---------------------------

    it("RestApi.request should throw an error if HTTP Service does not return a promise", () => {

        // prepare
        RestApi.http = () => { return "AAA"; };
        RestApi._url = "BBB";

        // call & assert
        expect( RestApi.request ).toThrowError( RestApi.MESSAGE_INVALID_HTTP_SERVICE );

    });

    //---------------------------
    // Transformers
    //---------------------------

    it("RestApi.request should (on success) call successTransformer with response & active_record_class. successTransformer should supersede responseTransformer.", ( done ) => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator   = () => {};

        class AR extends ActiveRecord {}

        // spy
        spyOn( RestApi, 'responseTransformer' );
        spyOn( RestApi, 'successTransformer' );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( RestApi.responseTransformer ).not.toHaveBeenCalled();
                expect( RestApi.successTransformer ).toHaveBeenCalledWith( {}, AR );
                done();
            }
        );
    });

    it("RestApi.request should (on success) call responseTransformer with response & active_record_class, if no successTransformer is provided", ( done ) => {

        // prepare
        // RestApi.http        = http_mock;
        RestApi.http        = () => {
            return new Promise( ( resolve, reject ) => {
                resolve( {} );
            } );
        };
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator   = () => {};

        class AR extends ActiveRecord {}

        // spy
        spyOn( RestApi, 'responseTransformer' );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( RestApi.responseTransformer ).toHaveBeenCalledWith( {}, AR );
                done();
            }
        );
    });

    it("RestApi.request should (on error) call errorTransformer with response & active_record_class. errorTransformer should supersede responseTransformer.", ( done ) => {

        // prepare
        RestApi.http        = http_mock_reject;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator   = () => {};

        class AR extends ActiveRecord {}

        // spy
        spyOn( RestApi, 'responseTransformer' );
        spyOn( RestApi, 'errorTransformer' );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {},
            ( response ) => {
                expect( RestApi.responseTransformer ).not.toHaveBeenCalled();
                expect( RestApi.errorTransformer ).toHaveBeenCalledWith( {}, AR );
                done();
            }
        );
    });

    it("RestApi.request should (on error) call responseTransformer with response & active_record_class, if no errorTransformer is provided", ( done ) => {

        // prepare
        RestApi.http        = http_mock_reject;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator   = () => {};

        class AR extends ActiveRecord {}

        // spy
        spyOn( RestApi, 'responseTransformer' );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {},
            ( response ) => {
                expect( RestApi.responseTransformer ).toHaveBeenCalledWith( {}, AR );
                done();
            }
        );
    });

    //---------------------------
    // Handlers
    //---------------------------

    it("RestApi.request should (on success) call successHandler with transformed response, and resolve only when successHandler resolves. successHandler should supersede responseHandler.", ( done ) => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator     = () => {};
        RestApi.responseTransformer = () => { return "BBB"; };

        class AR extends ActiveRecord {}

        // spy
        RestApi.responseHandler = jasmine.createSpy( 'responseHandler' );
        RestApi.successHandler = jasmine.createSpy( 'successHandler' ).and.returnValue(
            new Promise( ( resolve, reject ) => {
                resolve();
            } )
        );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( RestApi.responseHandler ).not.toHaveBeenCalled();
                expect( RestApi.successHandler ).toHaveBeenCalledWith( "BBB" );
                done();
            }
        );
    });

    it("RestApi.request should (on success) call responseHandler with response, if no successHandler is provided, and resolve only when responseHandler resolves", ( done ) => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator     = () => {};
        RestApi.responseTransformer = () => { return "BBB"; };

        class AR extends ActiveRecord {}

        // spy
        RestApi.responseHandler = jasmine.createSpy( 'responseHandler' ).and.returnValue(
            new Promise( ( resolve, reject ) => {
                resolve();
            } )
        );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( RestApi.responseHandler ).toHaveBeenCalledWith( "BBB" );
                done();
            }
        );
    });

    it("RestApi.request should (on success) resolve immediately with response if neither responseHandler nor successHandler are provided", ( done ) => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator     = () => {};
        RestApi.responseTransformer = () => { return "BBB"; };

        class AR extends ActiveRecord {}

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( response ).toEqual( "BBB" );
                done();
            }
        );
    });

    it("RestApi.request should (on error) call errorHandler with transformed response, and resolve only when errorHandler resolves", ( done ) => {

        // prepare
        RestApi.http        = http_mock_reject;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator     = () => {};
        RestApi.responseTransformer = () => { return "BBB"; };

        class AR extends ActiveRecord {}

        // spy
        RestApi.responseHandler = jasmine.createSpy( 'responseHandler' );
        RestApi.errorHandler = jasmine.createSpy( 'errorHandler' ).and.returnValue(
            new Promise( ( resolve, reject ) => {
                resolve();
            } )
        );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( RestApi.responseHandler ).not.toHaveBeenCalled();
                expect( RestApi.errorHandler ).toHaveBeenCalledWith( "BBB" );
                done();
            }
        );
    });

    it("RestApi.request should (on error) call response_handler with response, if no error_handler is provided, and resolve only when responseHandler resolves", ( done ) => {

        // prepare
        RestApi.http        = http_mock_reject;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator     = () => {};
        RestApi.responseTransformer = () => { return "BBB"; };

        class AR extends ActiveRecord {}

        // spy
        RestApi.responseHandler = jasmine.createSpy( 'responseHandler' ).and.returnValue(
            new Promise( ( resolve, reject ) => {
                resolve();
            } )
        );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( RestApi.responseHandler ).toHaveBeenCalledWith( "BBB" );
                done();
            }
        );
    });

    it("RestApi.request should (on error) reject immediately with response if neither responseHandler nor error_handler are provided", ( done ) => {

        // prepare
        RestApi.http        = http_mock_reject;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator     = () => {};
        RestApi.responseTransformer = () => { return "BBB"; };

        class AR extends ActiveRecord {}

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {},
            ( response ) => {
                expect( response ).toEqual( "BBB" );
                done();
            }
        );
    });

    //---------------------------------------------------
    // index
    //---------------------------------------------------

    it("RestApi.index should return the result of request", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        var r = RestApi.index( null );

        // assert
        expect( r ).toEqual( "BBB" );
    });

    it("RestApi.index should set request_config.method to GET", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        RestApi.index( "AAA" );

        // assert
        let expected_config = {
            method: "GET"
        };
        expect( RestApi.request ).toHaveBeenCalledWith( "AAA", expected_config );
    });

    //---------------------------------------------------
    // view
    //---------------------------------------------------

    it("RestApi.view should throw an error if id is not provided", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // assert
        expect( RestApi.view ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    });

    it("RestApi.view should return the result of request", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        var r = RestApi.view( null, 111 );

        // assert
        expect( r ).toEqual( "BBB" );
    });

    it("RestApi.view should set request_config.method to GET & sub_path to id parameters", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        RestApi.view( "AAA", 111 );

        // assert
        let expected_config = {
            method: "GET",
            sub_path: 111
        };
        expect( RestApi.request ).toHaveBeenCalledWith( "AAA", expected_config );
    });

    //---------------------------------------------------
    // add
    //---------------------------------------------------

    it("RestApi.add should return the result of request", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        var r = RestApi.add( null );

        // assert
        expect( r ).toEqual( "BBB" );
    });

    it("RestApi.add should set request_config.method to POST", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        RestApi.add( "AAA" );

        // assert
        let expected_config = {
            method: "POST"
        };
        expect( RestApi.request ).toHaveBeenCalledWith( "AAA", expected_config );
    });

    //---------------------------------------------------
    // edit
    //---------------------------------------------------

    it("RestApi.edit should throw an error if id is not provided", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // assert
        expect( RestApi.edit ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    });

    it("RestApi.edit should return the result of request", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        var r = RestApi.edit( null, 111 );

        // assert
        expect( r ).toEqual( "BBB" );
    });

    it("RestApi.edit should set request_config.method to PUT & sub_path to id parameters", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        RestApi.edit( "AAA", 111 );

        // assert
        let expected_config = {
            method: "PUT",
            sub_path: 111
        };
        expect( RestApi.request ).toHaveBeenCalledWith( "AAA", expected_config );
    });

    //---------------------------------------------------
    // delete
    //---------------------------------------------------

    it("RestApi.delete should throw an error if id is not provided", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // assert
        expect( RestApi.delete ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    });

    it("RestApi.delete should return the result of request", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        var r = RestApi.delete( null, 111 );

        // assert
        expect( r ).toEqual( "BBB" );
    });

    it("RestApi.delete should set request_config.method to PUT & sub_path to id parameters", () => {

        // spies
        spyOn( RestApi, "request" ).and.returnValue( "BBB" );

        // call
        RestApi.delete( "AAA", 111 );

        // assert
        let expected_config = {
            method: "DELETE",
            sub_path: 111
        };
        expect( RestApi.request ).toHaveBeenCalledWith( "AAA", expected_config );
    });
});
