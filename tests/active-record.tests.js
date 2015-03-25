/**
 * see documentation for how data model works
 */

describe('DataModel', function() {

    var BaseModel;
    var BaseActiveRecord;
    var AngularCakePHPApiUrl = 'http://www.mywebsite.com/api';

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

    //--------------------------------------------
    // extend
    //--------------------------------------------

    describe('BaseActiveRecord.extend', function() {
        // inject services (that we want to test)
        beforeEach(inject(function($injector) {
            injector = $injector;
            BaseActiveRecord = $injector.get('BaseActiveRecord');
            BaseModel = $injector.get('AngularCakePHPBaseModel');
        }));

     it('active record should be instance of BaseActiveRecord & MyActiveRecord', function() {
         function MyModel() {}
         function MyActiveRecord() {}
         var myModel = BaseModel.extend(MyModel, MyActiveRecord);
         var myActiveRecord = myModel.new();

         expect(myActiveRecord instanceof BaseActiveRecord.constructor).toBeTruthy();
         expect(myActiveRecord instanceof MyActiveRecord).toBeTruthy();
     });

     it('model should extend BaseActiveRecord methods', function() {
         function MyModel() {}
         function MyActiveRecord() {}
         var myModel = BaseModel.extend(MyModel, MyActiveRecord);
         var myActiveRecord = myModel.new();

         expect(typeof myActiveRecord.virtualField).toEqual('function');
         expect(typeof myActiveRecord.save).toEqual('function');
     });
    });

    //--------------------------------------------
    // save
    //--------------------------------------------
    /*describe('BaseActiveRecord.save', function() {
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

     it('active record should call BaseModel save', function() {
         spyOn(HttpResponseServiceMock, 'handleAddResponse');

         $httpBackend.when('POST', 'http://www.mywebsite.com/api/users').respond(200, {});

         function MyModel() {
             this.config = {api_endpoint: 'users'};
         }
         function MyAR(data) {
             this.id = data.id;
             this.name = data.name;
         }
         var myModel = BaseModel.extend(MyModel, MyAR);
         var myActiveRecord = myModel.new();

         // call method
         myActiveRecord.save();
         $httpBackend.flush();

         expect(HttpResponseServiceMock.handleAddResponse).toHaveBeenCalled();
     });

     it('active record should call BaseModel edit', function() {
         spyOn(HttpResponseServiceMock, 'handleEditResponse');

         $httpBackend.when('PUT', 'http://www.mywebsite.com/api/users/1').respond(200, {});

         function MyModel() {
             this.config = {api_endpoint: 'users'};
         }
         function MyAR(data) {
             this.id = data.id;
             this.name = data.name;
         }
         var myModel = BaseModel.extend(MyModel, MyAR);
         var myActiveRecord = myModel.new({
             id: 1
         });

         // call method
         myActiveRecord.save();
         $httpBackend.flush();

         expect(HttpResponseServiceMock.handleEditResponse).toHaveBeenCalled();
     });
    });

    //--------------------------------------------
    // delete
    //--------------------------------------------
    describe('BaseActiveRecord.delete', function() {
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

        it('active record should call BaseModel delete', function() {
            spyOn(HttpResponseServiceMock, 'handleDeleteResponse');

            $httpBackend.when('DELETE', 'http://www.mywebsite.com/api/users/1').respond(200, {});

            function MyModel() {
                this.config = {api_endpoint: 'users'};
            }
            function MyAR(data) {
                this.id = data.id;
                this.name = data.name;
            }

            var myModel = BaseModel.extend(MyModel, MyAR);
            var myActiveRecord = myModel.new({id: 1});

            // call method
            //myActiveRecord.delete();
            myModel.delete(1);
            $httpBackend.flush();

            expect(HttpResponseServiceMock.handleDeleteResponse).toHaveBeenCalled();
        });
    });*/

    //--------------------------------------------
    // validate
    //--------------------------------------------
    describe('BaseActiveRecord.validate', function() {


    });

    //--------------------------------------------
    // virtual fields
    //--------------------------------------------

    describe('virtual fields', function() {

     // ----------------------
     // virtualField
     // ----------------------

        it('should throw exception if name not supplied', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(function() { myActiveRecord.virtualField(); }).toThrow();
        });

        it('should throw exception if name not string', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(function() { myActiveRecord.virtualField(['test']); }).toThrow();
        });

        it('should throw exception if value not supplied', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(function() { myActiveRecord.virtualField('test'); }).toThrow();
        });

        it('should throw exception if value not function', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(function() { myActiveRecord.virtualField('test', ['test']); }).toThrow();
        });

        it('should return name as concat of firstname and surname', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(myActiveRecord.name).toEqual('MY NAME');
        });

     //it('should update', function() {
     //  expect(myActiveRecord.name).toEqual('MY NAME');
     //
     //  myActiveRecord.firstname = 'NEW';
     //  myActiveRecord.virtualFieldUpdate('name'); // we shouldn't need to do this but observe.js doesn't work in karma
     //  expect(myActiveRecord.name).toEqual('NEW NAME');
     //
     //  myActiveRecord.surname = 'PERSON';
     //  myActiveRecord.virtualFieldUpdate('name'); // we shouldn't need to do this but observe.js doesn't work in karma
     //  expect(myActiveRecord.name).toEqual('NEW PERSON');
     //});

     // ----------------------
     // virtualFieldUpdate
     // ----------------------

        it('should throw exception if name not supplied', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(function() { myActiveRecord.virtualFieldUpdate(); }).toThrow();
        });

        it('should throw exception if name not string', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(function() { myActiveRecord.virtualFieldUpdate(['test']); }).toThrow();
        });

        it('should throw exception if name not in object', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(function() { myActiveRecord.virtualFieldUpdate('asdf'); }).toThrow();
        });

        it('should throw exception if name not in virtual field', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(function() { myActiveRecord.virtualFieldUpdate('firstname'); }).toThrow();
        });

        it('should work', function() {
            var MyModel = function() {

            };
            var MyAR = function(data) {
                this.firstname = data.firstname;
                this.surname = data.surname;

                this.virtualField('name', function() {
                    return this.firstname + ' ' + this.surname;
                });
            };

            myModel = BaseModel.extend(MyModel, MyAR);
            myActiveRecord = myModel.new({firstname: 'MY', surname: 'NAME'});

            myActiveRecord.virtualFieldUpdate('name'); // TODO: remove this when you figure out how to

            expect(myActiveRecord.virtualFieldUpdate('name').name).toEqual(myActiveRecord.name);
        });
    });
});
