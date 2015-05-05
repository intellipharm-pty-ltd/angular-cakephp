/**
 * see documentation for how data model works
 */

describe('DataModel', function() {

    var Service;

    // load module
    beforeEach(module('AngularCakePHP'));

    // mock services
    beforeEach(module(function($provide) {
        $provide.value('HttpQueryBuildService', {});
    }));

    // inject services (that we want to test)
    beforeEach(inject(function($injector) {
        Service = $injector.get('TransformerService');
    }));

    //--------------------------------------------
    // transformRequestData
    //--------------------------------------------

    describe('transformRequestData', function() {

        // TODO: write tests here
    });

    //--------------------------------------------
    // transformRequestUrl
    //--------------------------------------------

    describe('transformRequestUrl', function() {

        // TODO: write tests here
    });
});
