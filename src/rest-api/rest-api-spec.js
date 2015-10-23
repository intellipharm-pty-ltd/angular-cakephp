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

    // //---------------------------------------------------
    // // pathGenerator
    // //---------------------------------------------------
    //
    // it("RestApi.path() should call RestApi.pathGenerator with the _.snakeCase of active_record_class name", () => {
    //
    //     // spy
    //     RestApi.pathGenerator = jasmine.createSpy('pathGenerator');
    //
    //     // prepare
    //     class AR extends ActiveRecord {}
    //
    //     // call
    //     let r = RestApi.path( AR );
    //
    //     // assert
    //     expect( RestApi.pathGenerator ).toHaveBeenCalledWith( 'ar' );
    // });
    //
    // //---------------------------------------------------
    // // path
    // //---------------------------------------------------
    //
    // it("Given a Class: RestApi.path() should call RestApi.pathGenerator with the active_record_class class's name, and return the result", () => {
    //
    //     // spy
    //     RestApi.pathGenerator = jasmine.createSpy('pathGenerator').and.returnValue( "AAA" );
    //
    //     // prepare
    //     class AR extends ActiveRecord {}
    //
    //     // call
    //     let r = RestApi.path( AR );
    //
    //     // assert
    //     expect( RestApi.pathGenerator ).toHaveBeenCalledWith( 'ar' );
    //     expect( r ).toEqual( "AAA" );
    // });
    //
    // it("Given a Function: RestApi.path() should call RestApi.pathGenerator with the active_record_class function's name, and return the result", () => {
    //
    //     // spy
    //     RestApi.pathGenerator = jasmine.createSpy( 'pathGenerator' ).and.returnValue( "AAA" );
    //
    //     // prepare
    //     let AR = function() {};
    //
    //     // call
    //     let r = RestApi.path( AR );
    //
    //     // assert
    //     expect( RestApi.pathGenerator ).toHaveBeenCalledWith( 'ar' );
    //     expect( r ).toEqual( "AAA" );
    // });

    //---------------------------------------------------
    // url
    //---------------------------------------------------

    // it("RestApi.url() should url if already set and if both active_record_class & config.path are not provided", () => {
    //
    //     // prepare
    //     RestApi._url = "AAA";
    //
    //     // call
    //     let r = RestApi.url();
    //
    //     // assert
    //     expect( r ).toEqual( "AAA" );
    // });

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
        try {
            let r = RestApi.request();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( RestApi.MESSAGE_HTTP_REQUIRED );
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

    it("RestApi.request should throw an error HTTP Service does not return a promise", () => {

        RestApi.http = () => { return "AAA"; };
        RestApi._url = "BBB";

        try {
            let r = RestApi.request();
        } catch ( error ) {
            var error_message = error.message;
        }

        expect( error_message ).toEqual( RestApi.MESSAGE_INVALID_HTTP_SERVICE );
    });

    //---------------------------
    // Transformers
    //---------------------------

    it("RestApi.request should (on success) call success_transformer with response & active_record_class", ( done ) => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator   = () => {};

        class AR extends ActiveRecord {}

        // spy
        spyOn( RestApi, 'successTransformer' );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( RestApi.successTransformer ).toHaveBeenCalledWith( {}, AR );
                done();
            }
        );
    });

    it("RestApi.request should (on success) call response_transformer with response & active_record_class, if no success_transformer is provided", ( done ) => {

        // prepare
        RestApi.http        = http_mock;
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

    it("RestApi.request should (on error) call error_transformer with response & active_record_class", ( done ) => {

        // prepare
        RestApi.http        = http_mock_reject;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator   = () => {};

        class AR extends ActiveRecord {}

        // spy
        spyOn( RestApi, 'errorTransformer' );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {},
            ( response ) => {
                expect( RestApi.errorTransformer ).toHaveBeenCalledWith( {}, AR );
                done();
            }
        );
    });

    it("RestApi.request should (on error) call response_transformer with response & active_record_class, if no error_transformer is provided", ( done ) => {

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

    it("RestApi.request should (on success) call success_handler with transformed response, and resolve only when success_handler resolves", ( done ) => {

        // prepare
        RestApi.http        = http_mock;
        RestApi._headers    = {};
        RestApi._hostname   = "AAA";
        RestApi._path_generator   = () => {};
        RestApi.responseTransformer = () => { return "BBB"; };

        class AR extends ActiveRecord {}

        // spy
        RestApi.successHandler = jasmine.createSpy( 'successHandler' ).and.returnValue(
            new Promise( ( resolve, reject ) => {
                resolve();
            } )
        );

        // call & assert
        RestApi.request( AR ).then(
            ( response ) => {
                expect( RestApi.successHandler ).toHaveBeenCalledWith( "BBB" );
                done();
            }
        );
    });

    it("RestApi.request should (on success) call response_handler with response, if no success_handler is provided, and resolve only when response_handler resolves", () => {
        // ...
    });

    it("RestApi.request should (on success) resolve immediately with response if neither response_handler nor success_handler are provided", () => {
        // ...
    });

    it("RestApi.request should (on error) call error_handler with transformed response, and resolve only when error_handler resolves", () => {
        // ...
    });

    it("RestApi.request should (on error) call response_handler with response, if no error_handler is provided, and resolve only when response_handler resolves", () => {
        // ...
    });

    it("RestApi.request should (on error) reject immediately with response if neither response_handler nor error_handler are provided", () => {
        // ...
    });

    //---------------------------
    // HTTP Service
    //---------------------------
    //
    // it("RestApi.request should call http with provided config", () => {
    //
    //     // // spy
    //     // RestApi.http = http_mock;
    //     // spyOn( RestApi, 'http' ).and.returnValue( http_mock() );
    //     //
    //     // // prepare
    //     // RestApi._url = "AAA";
    //
    //     // spies
    //     let successHandler = jasmine.createSpy('successHandler').and.returnValue(
    //         new Promise( ( resolve, reject ) => {
    //             resolve( "AAA" );
    //         } )
    //     );
    //     let successHandlerGlobal = jasmine.createSpy('successHandler').and.returnValue(
    //         new Promise( ( resolve, reject ) => {
    //             resolve( "AAA" );
    //         } )
    //     );
    //     let responseHandler = jasmine.createSpy('responseHandler').and.returnValue(
    //         new Promise( ( resolve, reject ) => {
    //             resolve( "AAA" );
    //         } )
    //     );
    //
    //     // prepare
    //     RestApi.http = () => {
    //         return new Promise( ( resolve, reject ) => {
    //             resolve( "AAA" );
    //         } );
    //     };
    //     RestApi._url = "CCC";
    //     RestApi.successHandler = successHandlerGlobal;
    //
    //     // prepare assert
    //     let assert = ( state, response ) => {
    //         expect( state ).toEqual( "PASS" );
    //         expect( successHandler ).toHaveBeenCalledWith( "AAA" );
    //         expect( successHandlerGlobal ).not.toHaveBeenCalled();
    //      response_transformer   expect( responseHandler ).not.toHaveBeenCalled();
    //         done();
    //     };
    //
    //     // call
    //     RestApi.request( null, {successHandler: successHandler, responseHandler: responseHandler} ).then(
    //         ( response ) => { assert( "PASS", response ); },
    //         ( response ) => { assert( "FAIL", response ); }
    //     );
    //
    //     RestApi.request( null, { 'a': "A" } );
    //
    //     // assert
    //     expect( RestApi.http ).toHaveBeenCalledWith( { 'a': "A", 'url': "AAA" } );
    // });
    //
    // describe("success", () => {
    //
    //     // ASYNC test
    //     it("RestApi.request should (on pass) call success handler (if provided) not the global success handler or response handler", ( done ) => {
    //
    //         // spy
    //         let successHandler = jasmine.createSpy('successHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } )
    //         );
    //         let successHandlerGlobal = jasmine.createSpy('successHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } )
    //         );
    //         let responseHandler = jasmine.createSpy('responseHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } )
    //         );
    //
    //         // prepare
    //         RestApi.http = () => {
    //             return new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } );
    //         };
    //         RestApi.activeRecordClass = "BBB";
    //         RestApi.hostname = "CCC";
    //         RestApi.path = "CCC";
    //         RestApi.successHandler = successHandlerGlobal;
    //
    //         // prepare assert
    //         let assert = ( state, response ) => {
    //             expect( state ).toEqual( "PASS" );
    //             expect( successHandler ).toHaveBeenCalledWith( "AAA" );
    //             expect( successHandlerGlobal ).not.toHaveBeenCalled();
    //             expect( responseHandler ).not.toHaveBeenCalled();
    //             done();
    //         };
    //
    //         // call
    //         RestApi.request( null, {successHandler: successHandler, responseHandler: responseHandler} ).then(
    //             ( response ) => { assert( "PASS", response ); },
    //             ( response ) => { assert( "FAIL", response ); }
    //         );
    //     });
    //
    //     // ASYNC test
    //     it("RestApi.request should (on pass) call success transformer (if provided) not the global success transformer or response transformer", ( done ) => {
    //
    //         // spy
    //         let successTransformer = jasmine.createSpy('successTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "DDDD" );
    //             } )
    //         );
    //         let successTransformerGlobal = jasmine.createSpy('successTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "EEEE" );
    //             } )
    //         );
    //         let responseTransformer = jasmine.createSpy('responseTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "FFFF" );
    //             } )
    //         );
    //
    //         // prepare
    //         RestApi.http = () => {
    //             return new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } );
    //         };
    //         RestApi.activeRecordClass = "BBB";
    //         RestApi.hostname = "CCC";
    //         RestApi.path = "CCC";
    //         RestApi.successTransformer = successTransformerGlobal;
    //
    //         // prepare assert
    //         let assert = ( state, response ) => {
    //             expect( state ).toEqual( "PASS" );
    //             expect( successTransformer ).toHaveBeenCalledWith( "AAA", "BBB" );
    //             expect( successTransformerGlobal ).not.toHaveBeenCalled();
    //             expect( responseTransformer ).not.toHaveBeenCalled();
    //             done();
    //         };
    //
    //         // call
    //         RestApi.request( null, {successTransformer: successTransformer, responseTransformer: responseTransformer} ).then(
    //             ( response ) => { assert( "PASS", response ); },
    //             ( response ) => { assert( "FAIL", response ); }
    //         );
    //     });
    // });
    //
    // describe("error", () => {
    //
    //     // ASYNC test
    //     it("RestApi.request should (on fail) call error handler (if provided) not the global error handler or response handler", ( done ) => {
    //
    //         // spy
    //         let errorHandler = jasmine.createSpy('errorHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } )
    //         );
    //         let errorHandlerGlobal = jasmine.createSpy('errorHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } )
    //         );
    //         let responseHandler = jasmine.createSpy('responseHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } )
    //         );
    //
    //         // prepare
    //         RestApi.http = () => {
    //             return new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } );
    //         };
    //         RestApi.activeRecordClass = "BBB";
    //         RestApi.hostname = "CCC";
    //         RestApi.path = "CCC";
    //         RestApi.errorHandler = errorHandlerGlobal;
    //
    //         // prepare assert
    //         let assert = ( state, response ) => {
    //             expect( state ).toEqual( "FAIL" );
    //             expect( errorHandler ).toHaveBeenCalledWith( "AAA" );
    //             expect( errorHandlerGlobal ).not.toHaveBeenCalled();
    //             expect( responseHandler ).not.toHaveBeenCalled();
    //             done();
    //         };
    //
    //         // call
    //         RestApi.request( null, {errorHandler: errorHandler, responseHandler: responseHandler} ).then(
    //             ( response ) => { assert( "PASS", response ); },
    //             ( response ) => { assert( "FAIL", response ); }
    //         );
    //     });
    //
    //     // ASYNC test
    //     it("RestApi.request should (on fail) call error transformer (if provided) not the global error transformer or response transformer", ( done ) => {
    //
    //         // spy
    //         let errorTransformer = jasmine.createSpy('errorTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "DDDD" );
    //             } )
    //         );
    //         let errorTransformerGlobal = jasmine.createSpy('errorTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "EEEE" );
    //             } )
    //         );
    //         let responseTransformer = jasmine.createSpy('responseTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "FFFF" );
    //             } )
    //         );
    //
    //         // prepare
    //         RestApi.http = () => {
    //             return new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } );
    //         };
    //         RestApi.activeRecordClass = "BBB";
    //         RestApi.hostname = "CCC";
    //         RestApi.path = "CCC";
    //         RestApi.errorTransformer = errorTransformerGlobal;
    //
    //         // prepare assert
    //         let assert = ( state, response ) => {
    //             expect( state ).toEqual( "FAIL" );
    //             expect( errorTransformer ).toHaveBeenCalledWith( "AAA", "BBB" );
    //             expect( errorTransformerGlobal ).not.toHaveBeenCalled();
    //             expect( responseTransformer ).not.toHaveBeenCalled();
    //             done();
    //         };
    //
    //         // call
    //         RestApi.request( null, {errorTransformer: errorTransformer, responseTransformer: responseTransformer} ).then(
    //             ( response ) => { assert( "PASS", response ); },
    //             ( response ) => { assert( "FAIL", response ); }
    //         );
    //     });
    // });
    //
    // describe("response", () => {
    //
    //     // ASYNC test
    //     it("RestApi.request should (on pass) call response handler (if provided) not the global response handler", ( done ) => {
    //
    //         // spy
    //         let responseHandler = jasmine.createSpy('responseHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } )
    //         );
    //         let responseHandlerGlobal = jasmine.createSpy('responseHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } )
    //         );
    //
    //         // prepare
    //         RestApi.http = () => {
    //             return new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } );
    //         };
    //         RestApi.activeRecordClass = "BBB";
    //         RestApi.hostname = "CCC";
    //         RestApi.path = "CCC";
    //         RestApi.responseHandler = responseHandlerGlobal;
    //
    //         // prepare assert
    //         let assert = ( state, response ) => {
    //             expect( state ).toEqual( "PASS" );
    //             expect( responseHandler ).toHaveBeenCalledWith( "AAA" );
    //             expect( responseHandlerGlobal ).not.toHaveBeenCalled();
    //             done();
    //         };
    //
    //         // call
    //         RestApi.request( null, {responseHandler: responseHandler} ).then(
    //             ( response ) => { assert( "PASS", response ); },
    //             ( response ) => { assert( "FAIL", response ); }
    //         );
    //     });
    //
    //     // ASYNC test
    //     it("RestApi.request should (on pass) call response transformer (if provided) not the global response transformer", ( done ) => {
    //
    //         // spy
    //         let responseTransformer = jasmine.createSpy('responseTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "DDDD" );
    //             } )
    //         );
    //         let responseTransformerGlobal = jasmine.createSpy('responseTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 resolve( "EEEE" );
    //             } )
    //         );
    //
    //         // prepare
    //         RestApi.http = () => {
    //             return new Promise( ( resolve, reject ) => {
    //                 resolve( "AAA" );
    //             } );
    //         };
    //         RestApi.activeRecordClass = "BBB";
    //         RestApi.hostname = "CCC";
    //         RestApi.path = "CCC";
    //         RestApi.responseTransformer = responseTransformerGlobal;
    //
    //         // prepare assert
    //         let assert = ( state, response ) => {
    //             expect( state ).toEqual( "PASS" );
    //             expect( responseTransformer ).toHaveBeenCalledWith( "AAA", "BBB" );
    //             expect( responseTransformerGlobal ).not.toHaveBeenCalled();
    //             done();
    //         };
    //
    //         // call
    //         RestApi.request( null, {responseTransformer: responseTransformer} ).then(
    //             ( response ) => { assert( "PASS", response ); },
    //             ( response ) => { assert( "FAIL", response ); }
    //         );
    //     });
    //
    //     // ASYNC test
    //     it("RestApi.request should (on error) call response handler (if provided) not the global response handler", ( done ) => {
    //
    //         // spy
    //         let responseHandler = jasmine.createSpy('responseHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } )
    //         );
    //         let responseHandlerGlobal = jasmine.createSpy('responseHandler').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } )
    //         );
    //
    //         // prepare
    //         RestApi.http = () => {
    //             return new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } );
    //         };
    //         RestApi.activeRecordClass = "BBB";
    //         RestApi.hostname = "CCC";
    //         RestApi.path = "CCC";
    //         RestApi.responseHandler = responseHandlerGlobal;
    //
    //         // prepare assert
    //         let assert = ( state, response ) => {
    //             expect( state ).toEqual( "FAIL" );
    //             expect( responseHandler ).toHaveBeenCalledWith( "AAA" );
    //             expect( responseHandlerGlobal ).not.toHaveBeenCalled();
    //             done();
    //         };
    //
    //         // call
    //         RestApi.request( null, {responseHandler: responseHandler} ).then(
    //             ( response ) => { assert( "PASS", response ); },
    //             ( response ) => { assert( "FAIL", response ); }
    //         );
    //     });
    //
    //     // ASYNC test
    //     it("RestApi.request should (on error) call response transformer (if provided) not the global response transformer", ( done ) => {
    //
    //         // spy
    //         let responseTransformer = jasmine.createSpy('responseTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "DDDD" );
    //             } )
    //         );
    //         let responseTransformerGlobal = jasmine.createSpy('responseTransformer').and.returnValue(
    //             new Promise( ( resolve, reject ) => {
    //                 reject( "EEEE" );
    //             } )
    //         );
    //
    //         // prepare
    //         RestApi.http = () => {
    //             return new Promise( ( resolve, reject ) => {
    //                 reject( "AAA" );
    //             } );
    //         };
    //         RestApi.activeRecordClass = "BBB";
    //         RestApi.hostname = "CCC";
    //         RestApi.path = "CCC";
    //         RestApi.responseTransformer = responseTransformerGlobal;
    //
    //         // prepare assert
    //         let assert = ( state, response ) => {
    //             expect( state ).toEqual( "FAIL" );
    //             expect( responseTransformer ).toHaveBeenCalledWith( "AAA", "BBB" );
    //             expect( responseTransformerGlobal ).not.toHaveBeenCalled();
    //             done();
    //         };
    //
    //         // call
    //         RestApi.request( null, {responseTransformer: responseTransformer} ).then(
    //             ( response ) => { assert( "PASS", response ); },
    //             ( response ) => { assert( "FAIL", response ); }
    //         );
    //     });
    // });
    //
    // //---------------------------------------------------
    // // index
    // //---------------------------------------------------
    //
    // //---------------------------
    // // exceptions
    // //---------------------------
    //
    // it("RestApi.index should throw an error if url is not set", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = null;
    //     RestApi.path = null;
    //     RestApi.url = null;
    //
    //     // call & assert
    //
    //     try {
    //         let r = RestApi.index();
    //     } catch ( error ) {
    //         var error_message = error.message;
    //     }
    //     expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    //
    //     // TODO: not working because scope is lost
    //     // expect( RestApi.index ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    // });
    //
    // //---------------------------
    // // class property updates
    // //---------------------------
    //
    // it("RestApi.index should set RestApi.activeRecordClass if a value is provided", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = "AAA";
    //     RestApi.path = "AAA";
    //
    //     // call
    //     RestApi.index( "BBB" );
    //
    //     // assert
    //     expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    // });
    //
    // //---------------------------
    // // config param updates
    // //---------------------------
    //
    // it("RestApi.index should call RestApi.request with updated config", () => {
    //
    //     // spy
    //     spyOn( RestApi, 'request' );
    //
    //     // prepare
    //     RestApi.url = "AAA";
    //     RestApi.headers = "BBB";
    //
    //     // call
    //     RestApi.index( null );
    //
    //     // assert
    //     let _expected = { 'method': "GET", 'url': "AAA", 'headers': "BBB" };
    //     expect( RestApi.request ).toHaveBeenCalledWith( null, _expected );
    // });
    //
    // //---------------------------
    // // Promise
    // //---------------------------
    //
    // it("RestApi.index should return a promise", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.url = "AAA";
    //
    //     // call
    //     var p = RestApi.index( null );
    //
    //     // assert
    //     expect( p.then ).toBeDefined();
    // });
    //
    // //---------------------------------------------------
    // // view
    // //---------------------------------------------------
    //
    // //---------------------------
    // // exceptions
    // //---------------------------
    //
    // it("RestApi.view should throw an error if id is not provided", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = null;
    //     RestApi.path = null;
    //     RestApi.url = null;
    //
    //     // call & assert
    //
    //     try {
    //         let r = RestApi.view();
    //     } catch ( error ) {
    //         var error_message = error.message;
    //     }
    //     expect( error_message ).toEqual( RestApi.MESSAGE_ID_IS_REQURIED );
    //
    //     // TODO: not working because scope is lost
    //     // expect( () => { RestApi.view(); } ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    // });
    //
    // it("RestApi.view should throw an error if url is not set", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = null;
    //     RestApi.path = null;
    //     RestApi.url = null;
    //
    //     // call & assert
    //
    //     try {
    //         let r = RestApi.view( null, 123 );
    //     } catch ( error ) {
    //         var error_message = error.message;
    //     }
    //     expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    //
    //     // TODO: not working because can't pass function to expect
    //     // expect( () => { RestApi.view( 123 ); } ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    // });
    //
    // //---------------------------
    // // class property updates
    // //---------------------------
    //
    // it("RestApi.view should set RestApi.activeRecordClass if a value is provided", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = "AAA";
    //     RestApi.path = "AAA";
    //
    //     // call
    //     RestApi.view( "BBB", 123);
    //
    //     // assert
    //     expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    // });
    //
    // //---------------------------
    // // config param updates
    // //---------------------------
    //
    // it("RestApi.view should call RestApi.request with updated config", () => {
    //
    //     // spy
    //     spyOn(RestApi, 'request');
    //
    //     // prepare
    //     RestApi.url = "AAA";
    //     RestApi.headers = "BBB";
    //
    //     // call
    //     RestApi.view( null, 123 );
    //
    //     // assert
    //     let _expected = { 'method': "GET", 'url': "AAA/123", 'headers': "BBB" };
    //     expect( RestApi.request ).toHaveBeenCalledWith( null, _expected );
    // });
    //
    // //---------------------------
    // // Promise
    // //---------------------------
    //
    // it("RestApi.view should return a promise", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.url = "AAA";
    //
    //     // call
    //     var p = RestApi.view( null, 123 );
    //
    //     // assert
    //     expect( p.then ).toBeDefined();
    // });
    //
    // //---------------------------------------------------
    // // add
    // //---------------------------------------------------
    //
    // //---------------------------
    // // exceptions
    // //---------------------------
    //
    // it("RestApi.add should throw an error if url is not set", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = null;
    //     RestApi.path = null;
    //     RestApi.url = null;
    //
    //     // call & assert
    //
    //     try {
    //         let r = RestApi.add();
    //     } catch ( error ) {
    //         var error_message = error.message;
    //     }
    //     expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    //
    //     // TODO: not working because scope is lost
    //     // expect( RestApi.add ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    // });
    //
    // //---------------------------
    // // class property updates
    // //---------------------------
    //
    // it("RestApi.add should set RestApi.activeRecordClass if a value is provided", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = "AAA";
    //     RestApi.path = "AAA";
    //
    //     // call
    //     RestApi.add( "BBB" );
    //
    //     // assert
    //     expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    // });
    //
    // //---------------------------
    // // config param updates
    // //---------------------------
    //
    // it("RestApi.add should call RestApi.request with updated config", () => {
    //
    //     // spy
    //     spyOn(RestApi, 'request');
    //
    //     // prepare
    //     RestApi.url = "AAA";
    //     RestApi.headers = "BBB";
    //
    //     // call
    //     RestApi.add( null, {}, { 'a': "A" } );
    //
    //     // assert
    //     let _expected = { 'method': "POST", 'url': "AAA", 'data': { 'a': "A" }, 'headers': "BBB" };
    //     expect( RestApi.request ).toHaveBeenCalledWith( null, _expected );
    // });
    //
    // //---------------------------
    // // Promise
    // //---------------------------
    //
    // it("RestApi.add should return a promise", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.url = "AAA";
    //
    //     // call
    //     var p = RestApi.add( null );
    //
    //     // assert
    //     expect( p.then ).toBeDefined();
    // });
    //
    // //---------------------------------------------------
    // // edit
    // //---------------------------------------------------
    //
    // //---------------------------
    // // exceptions
    // //---------------------------
    //
    // it("RestApi.edit should throw an error if id is not provided", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = null;
    //     RestApi.path = null;
    //     RestApi.url = null;
    //
    //     // call & assert
    //
    //     try {
    //         let r = RestApi.edit();
    //     } catch ( error ) {
    //         var error_message = error.message;
    //     }
    //     expect( error_message ).toEqual( RestApi.MESSAGE_ID_IS_REQURIED );
    //
    //     // TODO: not working because scope is lost
    //     // expect( RestApi.edit ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    // });
    //
    // it("RestApi.edit should throw an error if url is not set", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = null;
    //     RestApi.path = null;
    //     RestApi.url = null;
    //
    //     // call & assert
    //
    //     try {
    //         let r = RestApi.edit( null, 123 );
    //     } catch ( error ) {
    //         var error_message = error.message;
    //     }
    //     expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    //
    //     // TODO: not working because can't pass function to expect
    //     // expect( () => { RestApi.edit( 123 ); } ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    // });
    //
    // //---------------------------
    // // class property updates
    // //---------------------------
    //
    // it("RestApi.edit should set RestApi.activeRecordClass if a value is provided", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = "AAA";
    //     RestApi.path = "AAA";
    //
    //     // call
    //     RestApi.edit( "BBB", 123);
    //
    //     // assert
    //     expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    // });
    //
    // //---------------------------
    // // config param updates
    // //---------------------------
    //
    // it("RestApi.edit should call RestApi.request with updated config", () => {
    //
    //     // spy
    //     spyOn(RestApi, 'request');
    //
    //     // prepare
    //     RestApi.url = "AAA";
    //     RestApi.headers = "BBB";
    //
    //     // call
    //     RestApi.edit( null, 123, {}, { 'a': "A" } );
    //
    //     // assert
    //     let _expected = { 'method': "PUT", 'url': "AAA/123", 'data': { 'a': "A" }, 'headers': "BBB" };
    //     expect( RestApi.request ).toHaveBeenCalledWith( null, _expected );
    // });
    //
    // //---------------------------
    // // Promise
    // //---------------------------
    //
    // it("RestApi.edit should return a promise", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.url = "AAA";
    //
    //     // call
    //     var p = RestApi.edit( null, 123 );
    //
    //     // assert
    //     expect( p.then ).toBeDefined();
    // });
    //
    // //---------------------------------------------------
    // // delete
    // //---------------------------------------------------
    //
    // //---------------------------
    // // exceptions
    // //---------------------------
    //
    // it("RestApi.delete should throw an error if id is not provided", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.url = "AAA";
    //
    //     // call & assert
    //
    //     try {
    //         let r = RestApi.delete();
    //     } catch ( error ) {
    //         var error_message = error.message;
    //     }
    //     expect( error_message ).toEqual( RestApi.MESSAGE_ID_IS_REQURIED );
    //
    //     // TODO: not working because scope is lost
    //     // expect( RestApi.delete ).toThrowError( RestApi.MESSAGE_ID_IS_REQURIED );
    // });
    //
    // it("RestApi.delete should throw an error if url is not set", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.url = null;
    //     RestApi.hostname = null;
    //     RestApi.path = null;
    //
    //     // call & assert
    //
    //     try {
    //         let r = RestApi.delete( null, 123 );
    //     } catch ( error ) {
    //         var error_message = error.message;
    //     }
    //     expect( error_message ).toEqual( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    //
    //     // TODO: not working because scope is lost
    //     // expect( RestApi.delete ).toThrowError( RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED );
    // });
    //
    //
    // //---------------------------
    // // class property updates
    // //---------------------------
    //
    // it("RestApi.delete should set RestApi.activeRecordClass if a value is provided", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.hostname = "AAA";
    //     RestApi.path = "AAA";
    //
    //     // call
    //     RestApi.delete( "BBB", 123);
    //
    //     // assert
    //     expect( RestApi.activeRecordClass ).toEqual( "BBB" );
    // });
    //
    // //---------------------------
    // // config param updates
    // //---------------------------
    //
    // it("RestApi.delete should call RestApi.request with updated config", () => {
    //
    //     // spy
    //     spyOn(RestApi, 'request');
    //
    //     // prepare
    //     RestApi.url = "AAA";
    //     RestApi.headers = "BBB";
    //
    //     // call
    //     RestApi.delete( null, 123 );
    //
    //     // assert
    //     let _expected = { 'method': "DELETE", 'url': "AAA/123", 'headers': "BBB" };
    //     expect( RestApi.request ).toHaveBeenCalledWith( null, _expected );
    // });
    //
    // //---------------------------
    // // Promise
    // //---------------------------
    //
    // it("RestApi.delete should return a promise", () => {
    //
    //     // prepare
    //     RestApi.http = http_mock;
    //     RestApi.url = "AAA";
    //
    //     // call
    //     var p = RestApi.delete( null, 123 );
    //
    //     // assert
    //     expect( p.then ).toBeDefined();
    // });
});
