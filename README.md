# angular-cakephp

## Dependencies
angular-cakephp depends on [AngularJS](https://github.com/angular/angular.js), and [Lodash](https://github.com/lodash/lodash)

## Installation

```js
bower install angular-cakephp --save
```
```html
<script src='bower_components/angular-cakephp/dist/angular-cakephp.min.js'></script>
```

## Getting Started

##### Set module settings

```js
angular.module('AngularCakePHP')
    // required - the base url to the api
    .value('AngularCakePHPApiUrl', 'http://example.com/api')
        // optional (defaults to true) - sets the default timestamps config of all models. Can be overidden on each model
    .value('AngularCakePHPTimestamps', true)
    // optional - will run if no model api_endpoint is explicitly set
    // takes a function that should return the api_endpoint
    .value('AngularCakePHPApiEndpointTransformer', function(value) {
        return value + 's';
    })
    // can be external library like pluralize
    .value('AngularCakePHPApiEndpointTransformer', pluralize)
    // optional - function to transform the url params of an index, view or GET api query. Must return an array of url params eg. [limit: 2, page: 4, search: 'name']
    .value('AngularCakePHPUrlParamTransformer', function(params) {
        return params;
    })
    // optional - functions that handles a response from the service and must either resolve or reject
    .value('AngularCakePHPApiIndexResponseTransformer', null)
    .value('AngularCakePHPApiViewResponseTransformer', null)
    .value('AngularCakePHPApiEditResponseTransformer', null)
    .value('AngularCakePHPApiAddResponseTransformer', null)
    .value('AngularCakePHPApiDeleteResponseTransformer', null)
    .value('AngularCakePHPApiValidateResponseTransformer', null)
    .value('AngularCakePHPApiValidateErrorResponseTransformer', null)
    .value('AngularCakePHPApiErrorResponseTransformer', function(resolve, reject, model, response, status, headers, config) {
        resolve(response);
    });
```

##### Create a model

```js
(function() {
    'use strict';

    var UserModel = function(BaseModel) {

        function UserModel() {
			this.config = {
                // the resource to hit that will be appended to the AngularCakePHPApiUrl (i.e. http://example.com/api/users)
                // if left blank it will snake case the model class name (e.g. SpecialUser becomes special_user). If you then need to modify the automatic api_endpoint you can use the AngularCakePHPApiEndpointTransformer setting.
				api_endpoint: 'users',
                // optional (defaults to true) - whether or not to automatically add created and modified fields to the model
                timestamps: true
			};
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

##### Using the model
For more information see [API.md](https://github.com/Intellipharm/angular-cakephp/blob/master/API.md)

```js
(function() {
    'use strict';

    var AppCtrl = function($scope, UserModel) {
        // creates a new local active record
        $scope.User = UserModel.new({
            firstname: 'Goeffry',
            lastname: 'Rush'
        });

        // gets a list of items
        UserModel.index({page: 2}).then(function(Users) {
            $scope.Users = Users.data;
        });

        // gets a single item
        UserModel.view(1, {contain: 'Comments'}).then(function(User) {
            $scope.User = User.data;
        });

        // adds an item
        UserModel.add({
            firstname: 'Mike',
            surname: 'Myers'
        }).then(function(User) {
            $scope.User = User.data;
        });

        // edits an existing item
        UserModel.edit(1, {
            firstname: 'Michael',
            lastname: 'Buble'
        }).then(function(User) {
            $scope.User = User.data;
        });

        // deletes an item
        UserModel.delete(1).then(function() {
            $scope.User = null.data;
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
   };

    AppCtrl.$inject = ['$scope', 'UserModel'];

    angular.module('App').controller('AppCtrl', AppCtrl);
})();
```

##### Using the active record
For more information see [API.md](https://github.com/Intellipharm/angular-cakephp/blob/master/API.md)

```js
(function() {
    'use strict';

    var AppCtrl = function($scope, UserModel) {
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

        // saves the changes to the database. If no id exists then it calls model.add, but if id does exist it calls model.edit
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


## Inspiration
Inspiration taken from
  * [restangular](https://github.com/mgonto/restangular)
  * [ngActiveResource](https://github.com/FacultyCreative/ngActiveResource)
  * [ember-data](https://github.com/emberjs/data)
