# angular-cakephp

## Dependencies
angular-cakephp depends on [AngularJS](https://github.com/angular/angular.js), [Lodash](https://github.com/lodash/lodash), and [Pluralize](https://github.com/blakeembrey/pluralize)

## Installation

```js
bower install angular-cakephp --save
```
```html
<script src="bower_components/angular-cakephp/dist/angular-cakephp.min.js"></script>
```

## Getting Started

##### Set API base url

```js
angular.module('AngularCakePHP')
    .value('AngularCakePHPApiUrl', 'http://example.com/api');
```

##### Create a model

```js
'use strict';
(function() {
    var UserModel = function(BaseModel) {

        function UserModel() {
			this.config = {
				api_endpoint: ""
			}
		}

        function User(data) {
            this.id        = data.id;
            this.firstname = data.firstname;
            this.lastname  = data.lastname;
            this.dob       = data.dob;

            // creates a field that is read-only and automatically updates
            this.virtualField('name', function() {
                return this.firstname + ' ' + this.lastname;
            });
        }

        return BaseModel.extend(UserModel, User);
    };

    UserModel.$inject = ['AngularCakePHPBaseModel'];

    angular.module('App').factory('UserModel', UserModel);
})();
```

##### Use the model

```js
'use strict';
(function() {
    var AppCtrl = function($scope, UserModel) {
        // creates a new local active record
        $scope.User = UserModel.new({
            firstname: 'Goeffry',
            lastname: 'Rush'
        });

        // gets a list of items
        UserModel.index({page: 2}).then(function(Users) {
            $scope.Users = Users;
        });

        // gets a single item
        UserModel.view(1, {contain: 'Comments'}).then(function(User) {
            $scope.User = User;
        });

        // adds an item
        UserModel.add({
            firstname: 'Mike',
            surname: 'Myers'
        }).then(function(User) {
            $scope.User = User;
        });

        // edits an existing item
        UserModel.edit(1, {
            firstname: 'Michael',
            lastname: 'Buble'
        }).then(function(User) {
            $scope.User = User;
        });

        // deletes an item
        UserModel.delete(1).then(function() {
            $scope.User = null;
        });

        // calls a validation method on the api for the model. This runs the CakePHP model validation without changing anything in the database. This reduces the client side validation. For more information see [validation](https://github.com/Intellipharm/angular-cakephp/blob/master/VALIDATE.md)
        UserModel.validate({
            firstname: 'Jack',
            lastname: 'Daniels',
            dob: 1234
        }, [
            'dob'
        ]).then(function() {
            $scope.User = null;
        });

        // calls a custom method for the model
        UserModel.api('my_custom_api_method', {}, 'POST').then(function() {
            $scope.User = null;
        });


        // After getting an Active Record then you can call some of it's own functions
        $scope.User = UserModel.new({
            firstname: 'Ian',
            surname: 'Mckellen'
        });

        // create a new local active record. Alias of model.new()
        $scope.NewUser = $scope.User.new({
            firstname: 'Heath',
            surname: 'Ledger'
        });

        // update a value
        $scope.User.firstname = 'Sean'
        $scope.User.lastname = 'Bean';

        // get a virtual field
        console.log($scope.User.name); // This would return 'Sean Bean'

        // saves the changes to the database. If no id exists then it calls model.add, but if it does exist it calls model.edit
        $scope.User.save().then(function() {});

        // deletes the item. Alias of model.delete()
        $scope.User.delete().then(function() {});

        // validates the item. Alias of model.validate()
        $scope.User.validate().then(function() {});
        
        // gets the class name of the model. In this case it would return 'User'
        var modelName = $scope.User.getClassName();
    };

    AppCtrl.$inject = ['$scope', 'UserModel'];

    angular.module('App').controller('AppCtrl', AppCtrl);
})();

```


## Data Model config options

```js
'use strict';
(function() {
    var UserModel = function(BaseModel) {

        function UserModel() {
			this.config = {
				// set here
			}
		}
		....
```

#### api_endpoint

This will be appended to your API URL when any HTTP call is made via the model.
eg. if your user model has an api_endpoint of users, and your API URL is set to http://www.google.com, then the result HTTP call will be http://www.google.com/users.

If not set, the api_endpoint will be the snake case of your model class name.
eg. a model called SpecialUser, will have an api_endpoint of special_user




## Setttings

provided via
```js
angular.module('DataModel').value('DataModelApiUrl', 'http://example.com/api');
```

##### AngularCakePHPApiUrl

The URL of your API.

```js
angular.module('AngularCakePHP')
    .value('AngularCakePHPApiUrl', 'http://example.com/api');
```

##### AngularCakePHPApiEndpointPluralize

OPTIONAL

Method to pluralize the api_endpoint.
Is only called if no api_endpoint is set in teh model config.

```js
angular.module('AngularCakePHP')
    .value('AngularCakePHPApiEndpointPluralize', function(endpoint) {
			return endpoint +"s";
		});
```


Alternatively you can use an external library like Pluralize:
[Pluralize](https://github.com/blakeembrey/pluralize)

Simply include pluralize and specify its use as follows: 

```js
angular.module('AngularCakePHP')
    .value('AngularCakePHPApiEndpointPluralize', pluralize);
```


## Model API

### properties

active_record_class
config

### methods

extend
new
index
view
add
edit
delete
validate
api


## Active Record API

### properties

model

### methods

extend
save
new
delete
getClassName
virtualField
virtualFieldUpdate


## Inspiration
Inspiration taken from
    * [restangular](https://github.com/mgonto/restangular)
    * [ngActiveResource](https://github.com/FacultyCreative/ngActiveResource)
    * [ember-data](https://github.com/emberjs/data)
