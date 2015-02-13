/**
 * see documentation for how data model works
 */

describe("AngularCakePHP", function() {

	var BaseModel;
	var BaseActiveRecord;
	var HttpResponseServiceMock;
	var HttpQueryBuildServiceMock;
	var AngularCakePHPApiUrl = "http://www.mywebsite.com/api";
	var provide;

	// load module
	beforeEach(module('AngularCakePHP'));

	// mock settings
	beforeEach(module(function($provide) {
		provide = $provide;
		$provide.constant('AngularCakePHPApiUrl', AngularCakePHPApiUrl);
	}));

	// mock services
	beforeEach(module(function($provide) {
		HttpResponseServiceMock = {
			handleViewResponse: function() {},
			handleIndexResponse: function() {},
			handleAddResponse: function() {},
			handleEditResponse: function() {},
			handleDeleteResponse: function() {},
			handleErrorResponse: function() {}
		};
		$provide.value('HttpResponseService', HttpResponseServiceMock);

		HttpQueryBuildServiceMock = {};
		$provide.value('HttpQueryBuildService', HttpQueryBuildServiceMock);
	}));

	// inject services (that we want to test)
	beforeEach(inject(function($injector) {
		injector = $injector;
		BaseActiveRecord = $injector.get('BaseActiveRecord');
		BaseModel = $injector.get('AngularCakePHPBaseModel');
	}));

	//--------------------------------------------
	// extend
	//--------------------------------------------

	describe("BaseModel.extend", function() {

		it("should throw an exception if model arg is missing", function() {
			function MyModel() {}
			expect(function(){ BaseModel.extend(); }).toThrow();
		});

		it("should throw an exception if active_record arg is missing", function() {
			function MyModel() {}
			expect(function(){ BaseModel.extend({}); }).toThrow();
		});

		it("model should be instance of BaseModel & MyModel", function() {
			function MyModel() {}
			function MyActiveRecord() {}
			var myModel = BaseModel.extend(MyModel, MyActiveRecord);

			expect(myModel instanceof BaseModel.constructor).toBeTruthy();
			expect(myModel instanceof MyModel).toBeTruthy();
		});

		it("should set BaseModel properties for specific instance", function() {
			function UserModel() {}
			function User() {}
			var userModel = BaseModel.extend(UserModel, User);
			expect(userModel.active_record_class.name).toEqual("User");

			function CustomerModel() {}
			function Customer() {}
			var customerModel = BaseModel.extend(CustomerModel, Customer);

			expect(customerModel.active_record_class.name).toEqual("Customer");
			expect(userModel.active_record_class.name).toEqual("User");
		});

		it("should set config.api to AngularCakePHPApiUrl", function() {
			expect(BaseModel.config.api).toEqual(AngularCakePHPApiUrl);
		});

		it("should set model.config.api_endpoint if set", function() {

			function MyModel() {
				this.config = {api_endpoint: "MY ENDPOINT"};
			}
			function MyAR() {}
			var myModel = BaseModel.extend(MyModel, MyAR);
			expect(myModel.config.api_endpoint).toEqual("MY ENDPOINT");
		});

		it("multiple instance using extend should set config.api_endpoint to provided values", function() {

			function UserModel() {
				this.config = {api_endpoint: "USER ENDPOINT"};
			}
			function User() {}
			var userModel = BaseModel.extend(UserModel, User);
			expect(userModel.active_record_class.name).toEqual("User");

			function CustomerModel() {
				this.config = {api_endpoint: "CUSTOMER ENDPOINT"};
			}
			function Customer() {}
			var customerModel = BaseModel.extend(CustomerModel, Customer);

			expect(userModel.config.api_endpoint).toEqual("USER ENDPOINT");
			expect(customerModel.config.api_endpoint).toEqual("CUSTOMER ENDPOINT");
		});

		it("model should extend BaseModel methods", function() {

			function MyModel() {}
			function MyAR() {}
			var myModel = BaseModel.extend(MyModel, MyAR);

			expect(typeof myModel.new).toEqual('function');
			expect(typeof myModel.index).toEqual('function');
		});

		it("model should api_endpoint as snake case version of model name if api_endpoint is not set via model config", function() {

			function MyModel() {}
			function MyAR() {}
			var myModel = BaseModel.extend(MyModel, MyAR);

			expect(myModel.config.api_endpoint).toEqual('my_ar');
		});
	});

	//--------------------------------------------
	// new
	//--------------------------------------------

	describe("MyModel.new", function() {

		it("active record should not be instance of BaseModel", function() {
			function MyModel() {}
			function MyActiveRecord() {}
			var myModel = BaseModel.extend(MyModel, MyActiveRecord);
			var Jim = myModel.new({name: "Jim"});

			expect(Jim instanceof BaseModel.constructor).toBeFalsy();
		});

		it("should correctly populate active record data", function() {
			function UserModel() {
				this.config = {
					api: "someapi"
				}
			}
			function User(data) {
				this.name = data.name;
			}
			var userModel = BaseModel.extend(UserModel, User);
			var Jim = userModel.new({name: "Jim"});
			expect(Jim.name).toEqual("Jim");
		});

		it("extended myModel.new should set properties to undefined if no data is provided", function() {

			function MyModel() {}
			function MyActiveRecord(data) {
				this.name = data.name;
			}
			var myModel = BaseModel.extend(MyModel, MyActiveRecord);
			var myActiveRecord = myModel.new();

			expect(myActiveRecord.name).toBeUndefined();
		});
	});

	//--------------------------------------------
	// new (associations)
	//--------------------------------------------

	describe("MyModel.new", function() {

		// mock settings
		beforeEach(function() {

			function MemberModel() {
				this.config = {api_endpoint: "members"};
			}
			function Member(data) {
				this.name = data.name;
				this.extra = "EXTRA";
			}
			provide.value('MemberModel', BaseModel.extend(MemberModel, Member));
		});

		it("should create association model instances of associations", function() {

			function CustomerModel() {}
			function Customer(data) {
				this.name = data.name;
			}
			var customerModel = BaseModel.extend(CustomerModel, Customer);
			var customer = customerModel.new({name: "Jimmy", Member: {name: "Jimember"}});

			expect(customer.name).toEqual("Jimmy");
			expect(customer.Member.name).toEqual("Jimember");
			expect(customer.Member.extra).toEqual("EXTRA");
		});

		it("should create association model instances of association arrays", function() {

			function CustomerModel() {}
			function Customer(data) {
				this.name = data.name;
			}
			var customerModel = BaseModel.extend(CustomerModel, Customer);
			var customer = customerModel.new({name: "Jimmy", Member: [{name: "Jimember"}, {name: "MemberJim"}]});

			expect(customer.name).toEqual("Jimmy");
			expect(customer.Member[0].name).toEqual("Jimember");
			expect(customer.Member[0].extra).toEqual("EXTRA");
			expect(customer.Member[1].name).toEqual("MemberJim");
			expect(customer.Member[1].extra).toEqual("EXTRA");
		});
	});

	//--------------------------------------------
	// C.R.U.D
	//--------------------------------------------

	describe("MyModel C.R.U.D", function() {

		var $q;
		var $rootScope;
		var $http;
		var $httpBackend;
		var $injector;

		// inject angular services
		beforeEach(inject(function($injector) {

			// angular services
			$q = $injector.get('$q');
			$rootScope = $injector.get('$rootScope');
			$http = $injector.get('$http');

			// mock http responses
			$httpBackend = $injector.get('$httpBackend');
		}));

		//--------------------------------------------
		// index
		//--------------------------------------------

		describe("index", function() {


			it("should call HttpResponseService.handleIndexResponse on success", function() {

				spyOn(HttpResponseServiceMock, 'handleIndexResponse');

				$httpBackend.when('GET', "http://www.mywebsite.com/api/users")
					.respond(200, {data: [{name: "user one"}]});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.index();
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleIndexResponse).toHaveBeenCalled();
			});

			it("should call HttpResponseService.handleErrorResponse on error", function() {

				spyOn(HttpResponseServiceMock, 'handleErrorResponse');

				$httpBackend.when('GET', "http://www.mywebsite.com/api/users")
					.respond(400, {message: "error message"});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.index();
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleErrorResponse).toHaveBeenCalled();
			});
		});

		//--------------------------------------------
		// view
		//--------------------------------------------

		describe("view", function() {

			it("should throw an exception if id param is not set", function() {

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				expect(function(){ myModel.view(); }).toThrow();
			});

			it("should call HttpResponseService.handleViewResponse on success", function() {

				spyOn(HttpResponseServiceMock, 'handleViewResponse');

				$httpBackend.when('GET', "http://www.mywebsite.com/api/users/1")
					.respond(200, {data: {name: "user one"}});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.view(1);
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleViewResponse).toHaveBeenCalled();
			});

			it("should call HttpResponseService.handleErrorResponse on error", function() {

				spyOn(HttpResponseServiceMock, 'handleErrorResponse');

				$httpBackend.when('GET', "http://www.mywebsite.com/api/users/1")
					.respond(400, {message: "error message"});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.view(1);
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleErrorResponse).toHaveBeenCalled();
			});
		});

		//--------------------------------------------
		// add
		//--------------------------------------------

		describe("add", function() {

			it("should throw an exception if data param is not set", function() {

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				expect(function(){ myModel.add(); }).toThrow();
			});

			it("should call HttpResponseService.handleHttpAddResponse on success", function() {

				spyOn(HttpResponseServiceMock, 'handleAddResponse');

				$httpBackend.when('POST', "http://www.mywebsite.com/api/users")
					.respond(200, {data: {name: "user one"}});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.add({name: "new name"});
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleAddResponse).toHaveBeenCalled();
			});

			it("should call HttpResponseService.handleErrorResponse on error", function() {

				spyOn(HttpResponseServiceMock, 'handleErrorResponse');

				$httpBackend.when('POST', "http://www.mywebsite.com/api/users")
					.respond(400, {message: "error message"});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.add({name: "new name"});
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleErrorResponse).toHaveBeenCalled();
			});
		});

		//--------------------------------------------
		// edit
		//--------------------------------------------

		describe("edit", function() {

			it("should throw an exception if id param is not set", function() {

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				expect(function(){ myModel.edit(undefined, {}); }).toThrow();
			});

			it("should throw an exception if data param is not set", function() {

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				expect(function(){ myModel.edit(1); }).toThrow();
			});

			it("should call HttpResponseService.handleEditResponse on success", function() {

				spyOn(HttpResponseServiceMock, 'handleEditResponse');

				$httpBackend.when('PUT', "http://www.mywebsite.com/api/users/1")
					.respond(200, {data: {name: "user one"}});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.edit(1, {name: "new name"});
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleEditResponse).toHaveBeenCalled();
			});

			it("should call HttpResponseService.handleErrorResponse on error", function() {

				spyOn(HttpResponseServiceMock, 'handleErrorResponse');

				$httpBackend.when('PUT', "http://www.mywebsite.com/api/users/1")
					.respond(400, {message: "error message"});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.edit(1, {name: "new name"});
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleErrorResponse).toHaveBeenCalled();
			});
		});

		//--------------------------------------------
		// delete
		//--------------------------------------------

		describe("delete", function() {

			it("should throw an exception if id param is not set", function() {

				function MyModel() {}
				var config = {api_endpoint: "users"};
				var myModel = BaseModel.extend(MyModel, config);

				expect(function(){ myModel.delete(); }).toThrow();
			});

			it("should call HttpResponseService.handleDeleteResponse on success", function() {

				spyOn(HttpResponseServiceMock, 'handleDeleteResponse');

				$httpBackend.when('DELETE', "http://www.mywebsite.com/api/users/1")
					.respond(200, {data: null});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.delete(1);
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleDeleteResponse).toHaveBeenCalled();
			});

			it("should call HttpResponseService.handleErrorResponse on error", function() {

				spyOn(HttpResponseServiceMock, 'handleErrorResponse');

				$httpBackend.when('DELETE', "http://www.mywebsite.com/api/users/1")
					.respond(400, {message: "error message"});

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				myModel.delete(1);
				$httpBackend.flush();

				expect(HttpResponseServiceMock.handleErrorResponse).toHaveBeenCalled();
			});
		});

		//--------------------------------------------
		// api
		//--------------------------------------------

		describe("api", function() {

			it("should throw an exception if action param is not set", function() {

				function MyModel() {}
				var config = {api_endpoint: "users"};
				var myModel = BaseModel.extend(MyModel, config);

				expect(function(){ myModel.api(); }).toThrow();
			});

			it("should call api with custom_action", function() {

				$httpBackend.when('GET', "http://www.mywebsite.com/api/users/custom_action")
					.respond(200, "hello");

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				var result;
				myModel.api('custom_action').then(
					function(response) {
						result = response;
					}
				);
				$httpBackend.flush();

				expect(result.data).toEqual("hello");
			});

			it("should call api with custom_action and specified method", function() {

				$httpBackend.when('POST', "http://www.mywebsite.com/api/users/custom_action")
					.respond(200, "hello");

				function MyModel() {
					this.config = {api_endpoint: "users"};
				}
				function MyAR(data) {
					this.name = data.name;
				}
				var myModel = BaseModel.extend(MyModel, MyAR);

				// call method
				var result;
				myModel.api('custom_action', {}, 'POST').then(
					function(response) {
						result = response;
					}
				);
				$httpBackend.flush();

				expect(result.data).toEqual("hello");
			});
		});
	});
});
