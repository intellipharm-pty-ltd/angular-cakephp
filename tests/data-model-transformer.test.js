/**
 * see documentation for how data model works
 */

describe("DataModel", function() {

	var Service;

	// load module
	beforeEach(module('DataModel'));

	// mock services
	beforeEach(module(function($provide) {
		$provide.value('HttpQueryBuildService', {});
	}));

	// inject services (that we want to test)
	beforeEach(inject(function($injector) {
		Service = $injector.get('DataModelTransformerService');
	}));

	//--------------------------------------------
	// transformRequestData
	//--------------------------------------------

	describe("transformRequestData", function() {

		it("should remove model property if set", function() {
			var request_data = {
				a: "A",
				model: {}
			};
			request_data = Service.transformRequestData(request_data);

			//console.log("AAA: "+request_data);
			expect(_.has(request_data, 'model')).toBeFalsy();
		});
	});

	//--------------------------------------------
	// transformRequestUrl
	//--------------------------------------------

	describe("transformRequestUrl", function() {

		// TODO: write tests here
	});
});
