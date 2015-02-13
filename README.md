# angular-cakephp
An AngularJS data modelling framework that ties in with a CakePHP REST API.
Inspiration taken from
  * [Restangular](https://github.com/mgonto/restangular)
  * [Ng Active Resource](https://github.com/FacultyCreative/ngActiveResource)
  * [Ember Data](https://github.com/emberjs/data)


# Installation

```js
bower install angular-cakephp --save
```
```html
<script src="bower_components/angular-cakephp/dist/angular-cakephp.min.js"></script>
```

# Getting Started

The base url of the api you want to hit needs to be set

```js
angular.module('DataModel').value('DataModelApiUrl', 'http://example.com/api');
```

Then you just need to create your models

```js
'use strict';
(function() {
    var UserModel = function(BaseModel) {

    function UserModel() {}

    function User(data) {
      this.id       = data.id;
      this.email    = data.email;
      this.username = data.username;
      this.password = data.password;
    }

    return BaseModel.extend(UserModel, User);
    };

  UserModel.$inject = ['BaseModel'];

    angular.module('App').factory('UserModel', UserModel);
})();
```

And you are ready to start using it

```js
'use strict';
(function() {
  var AppCtrl = function($scope, UserModel) {
    // creates a new local active record
    $scope.User = UserModel.new({
      name: 'Goeffry Rush'
    });

    // gets a list of items
    UserModel.index({page: 2}).then(function(Users) {
      $scope.Users = Users;
    });

    // gets a single item
    UserModel.view(1).then(function(User) {
      $scope.User = User;
    });

    UserModel.add({
      name: 'Joe Bloggs'
    }).then(function(User) {
      $scope.User = User;
    });

    UserModel.edit(1, {
      name: 'Michael Buble'
    }).then(function(User) {
      $scope.User = User;
    });

    UserModel.delete(1).then(function() {
      $scope.User = null;
    });
  };

  AppCtrl.$inject = ['$scope', 'UserModel'];

  angular.module('App').controller('AppCtrl', AppCtrl);
})();

```

# Features

## Model Features
A model has all the standard CakePHP rest functions ```index, view, add, edit, delete```

  * ```index``` - gets a list of items - takes an object which are extra url parameters
  * ```view``` - gets a single item - takes an id and an object which are extra url parameters
  * ```add``` - adds an item - takes an object of the data to pass to the server
  * ```edit``` - edits a single item - takes an id and an object of the data to pass to the server
  * ```delete``` - deletes a single item - takes an id

It also has some non-standard cake features
  * ```new``` - creates a new LOCAL record.
  * ```api``` - calls a custom method for the model - takes a name of the action, the parameters to pass and the http method
  * ```validate``` - calls a validation custom method for the model. This just calls the cakephp validation method on the model without doing any changes to the database. We wrote this to minimise client side validation.

## Active Record Features

  * ```save``` - calls either the models ```edit``` or ```add``` depending on whether and id exists or not
  * ```new``` - alias for model new
  * ```delete``` - alias for model delete
  * ```validate``` - alias for model validate
  * ```getClassName``` - gets the name of the model class
  * ```virtualField``` - is like cakephp's virtualField. Will create a field that is based off other fields but cannot be directly changed and won't be sent to the apied by calling UserModel.new(data)
 - this returns a populated instance of UserModel


Future Plans
--------------------------------

functionality:

 - contain fields with default values (not connected to server Model or DB)
 - httpValidate (which calls server validation)
 - validate (which calls JS library validation)
 - CRUD api (that interfaces with server)
 - format data on response
 - format data before request

configuration:

 - server api address
 - validation library
 - methods
   - new (returns new instance of model)
 - CRUD api endpoints
   - index
   - add
   - edit
   - delete
 - action sequence config:
	eg.
	action_sequence_config = {
		'update': [
     			'validate',
     			'httpValidate',
     			'formatRequest'
		]
   	};
	then when calling model.update(data);
        will call:
	1) validate
	2) httpValidate
	3) formatRequest
	4) update

