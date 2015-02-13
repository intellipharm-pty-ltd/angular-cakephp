/**
 * see documentation for how data model works
 */

describe("DataModel", function() {

	var BaseModel;
	var BaseActiveRecord;
	var HttpReponseServiceMock;
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
		$provide.value('HttpResponseServiceMock', HttpResponseServiceMock);
		HttpQueryBuildServiceMock = {};
		$provide.value('HttpQueryBuildService', HttpQueryBuildServiceMock);
	}));

	// inject services (that we want to test)
	beforeEach(inject(function($injector) {
		injector = $injector;
		BaseActiveRecord = $injector.get('BaseActiveRecord');
		BaseModel = $injector.get('BaseModel');
	}));

	//--------------------------------------------
	// extend
	//--------------------------------------------

	//describe("BaseActiveRecord.extend", function() {
	//
	//	it("active record should be instance of BaseActiveRecord & MyActiveRecord", function() {
	//		function MyModel() {}
	//		function MyActiveRecord() {}
	//		var myModel = BaseModel.extend(MyModel, MyActiveRecord);
	//		var myActiveRecord = myModel.new();
	//
	//		expect(myActiveRecord instanceof BaseActiveRecord.constructor).toBeTruthy();
	//		expect(myActiveRecord instanceof MyActiveRecord).toBeTruthy();
	//	});
	//
	//	it("model should extend BaseActiveRecord methods", function() {
	//		function MyModel() {}
	//		function MyActiveRecord() {}
	//		var myModel = BaseModel.extend(MyModel, MyActiveRecord);
	//		var myActiveRecord = myModel.new();
	//
	//		expect(typeof myActiveRecord.virtualField).toEqual('function');
	//		expect(typeof myActiveRecord.save).toEqual('function');
	//	});
	//});

	////--------------------------------------------
	//// save
	////--------------------------------------------
	//describe("BaseActiveRecord.save", function() {
	//	var $q;
	//	var $rootScope;
	//	var $http;
	//	var $httpBackend;
	//	var $injector;
	//
	//	// inject angular services
	//	beforeEach(inject(function($injector) {
	//
	//		// angular services
	//		$q = $injector.get('$q');
	//		$rootScope = $injector.get('$rootScope');
	//		$http = $injector.get('$http');
	//
	//		// mock http responses
	//		$httpBackend = $injector.get('$httpBackend');
	//	}));
	//
	//	it("active record should call BaseModel save", function() {
	//		spyOn(DataModelHttpResponseServiceMock, 'handleAddResponse');
	//
	//		$httpBackend.when('POST', "http://www.mywebsite.com/api/users").respond(200, {});
	//
	//		function MyModel() {
	//			this.config = {api_endpoint: "users"};
	//		}
	//		function MyAR(data) {
	//			this.id = data.id;
	//			this.name = data.name;
	//		}
	//		var myModel = BaseModel.extend(MyModel, MyAR);
	//		var myActiveRecord = myModel.new();
	//
	//		// call method
	//		myActiveRecord.save();
	//		$httpBackend.flush();
	//
	//		expect(DataModelHttpResponseServiceMock.handleAddResponse).toHaveBeenCalled();
	//	});
	//
	//	it("active record should call BaseModel edit", function() {
	//		spyOn(DataModelHttpResponseServiceMock, 'handleEditResponse');
	//
	//		$httpBackend.when('PUT', "http://www.mywebsite.com/api/users/1").respond(200, {});
	//
	//		function MyModel() {
	//			this.config = {api_endpoint: "users"};
	//		}
	//		function MyAR(data) {
	//			this.id = data.id;
	//			this.name = data.name;
	//		}
	//		var myModel = BaseModel.extend(MyModel, MyAR);
	//		var myActiveRecord = myModel.new({
	//			id: 1
	//		});
	//
	//		// call method
	//		myActiveRecord.save();
	//		$httpBackend.flush();
	//
	//		expect(DataModelHttpResponseServiceMock.handleEditResponse).toHaveBeenCalled();
	//	});
	//});
	//
	////--------------------------------------------
	//// delete
	////--------------------------------------------
	//describe("BaseActiveRecord.delete", function() {
	//	var $q;
	//	var $rootScope;
	//	var $http;
	//	var $httpBackend;
	//	var $injector;
	//
	//	// inject angular services
	//	beforeEach(inject(function($injector) {
	//
	//		// angular services
	//		$q = $injector.get('$q');
	//		$rootScope = $injector.get('$rootScope');
	//		$http = $injector.get('$http');
	//
	//		// mock http responses
	//		$httpBackend = $injector.get('$httpBackend');
	//	}));
	//
	//	it("active record should call BaseModel delete", function() {
	//		spyOn(DataModelHttpResponseServiceMock, 'handleDeleteResponse');
	//
	//		$httpBackend.when('DELETE', "http://www.mywebsite.com/api/users/1").respond(200, {});
	//
	//		function MyModel() {
	//			this.config = {api_endpoint: "users"};
	//		}
	//		function MyAR(data) {
	//			this.id = data.id;
	//			this.name = data.name;
	//		}
	//		var myModel = BaseModel.extend(MyModel, MyAR);
	//		var myActiveRecord = myModel.new({
	//			id: 1
	//		});
	//
	//		// call method
	//		myActiveRecord.delete();
	//		$httpBackend.flush();
	//
	//		expect(DataModelHttpResponseServiceMock.handleDeleteResponse).toHaveBeenCalled();
	//	});
	//
	//});

	//--------------------------------------------
	// validate
	//--------------------------------------------
	//describe("BaseActiveRecord.validate", function() {
	//
	//
	//});

	//--------------------------------------------
	// virtual fields
	//--------------------------------------------

	//describe("virtual fields", function() {
	//
	//	beforeEach(inject(function() {
	//		this.MyModel = function() {
	//
	//		};
	//		this.MyAR = function(data) {
	//			this.firstname = data.firstname;
	//			this.surname = data.surname;
	//
	//			this.virtualField('name', function() {
	//				return this.firstname + ' ' + this.surname;
	//			});
	//		};
	//
	//		this.myModel = BaseModel.extend(this.MyModel, this.MyAR);
	//		this.myActiveRecord = this.myModel.new({firstname: 'MY', surname: 'NAME'});
	//
	//		this.myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to
	//	}));
	//
	//	// ----------------------
	//	// virtualField
	//	// ----------------------
	//
	//	it("should throw exception if name not supplied", function() {
	//		expect(function() { this.myActiveRecord.virtualField(); }).toThrow();
	//	});
	//
	//	it("should throw exception if name not string", function() {
	//		expect(function() { this.myActiveRecord.virtualField(['test']); }).toThrow();
	//	});
	//
	//	it("should throw exception if value not supplied", function() {
	//		expect(function() { this.myActiveRecord.virtualField('test'); }).toThrow();
	//	});
	//
	//	it("should throw exception if value not function", function() {
	//		expect(function() { this.myActiveRecord.virtualField('test', ['test']); }).toThrow();
	//	});
	//
	//	it("should return name as concat of firstname and surname", function() {
	//		expect(this.myActiveRecord.name).toEqual('MY NAME');
	//	});
	//
	//	//it("should update", function() {
	//	//	expect(this.myActiveRecord.name).toEqual('MY NAME');
	//	//
	//	//	this.myActiveRecord.firstname = 'NEW';
	//	//	this.myActiveRecord.virtualFieldUpdate('name'); // we shouldn't need to do this but observe.js doesn't work in karma
	//	//	expect(this.myActiveRecord.name).toEqual('NEW NAME');
	//	//
	//	//	this.myActiveRecord.surname = 'PERSON';
	//	//	this.myActiveRecord.virtualFieldUpdate('name'); // we shouldn't need to do this but observe.js doesn't work in karma
	//	//	expect(this.myActiveRecord.name).toEqual('NEW PERSON');
	//	//});
	//
	//	// ----------------------
	//	// virtualFieldUpdate
	//	// ----------------------
	//
	//	it("should throw exception if name not supplied", function() {
	//		expect(function() { this.myActiveRecord.virtualFieldUpdate(); }).toThrow();
	//	});
	//
	//	it("should throw exception if name not string", function() {
	//		expect(function() { this.myActiveRecord.virtualFieldUpdate(['test']); }).toThrow();
	//	});
	//
	//	it("should throw exception if name not in object", function() {
	//		expect(function() { this.myActiveRecord.virtualFieldUpdate('asdf'); }).toThrow();
	//	});
	//
	//	it("should throw exception if name not in virtual field", function() {
	//		expect(function() { this.myActiveRecord.virtualFieldUpdate('firstname'); }).toThrow();
	//	});
	//
	//	it("should work", function() {
	//		expect(this.myActiveRecord.virtualFieldUpdate('name')).toEqual(this.myActiveRecord);
	//	});
	//});
});
