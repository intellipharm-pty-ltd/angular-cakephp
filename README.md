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
angular.module('DataModel').value('DataModelApiUrl', 'http://example.com/api');
```

##### Create a model

```js
'use strict';
(function() {
    var UserModel = function(BaseModel) {

        function UserModel() {}

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

    UserModel.$inject = ['BaseModel'];

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

## Inspiration
Inspiration taken from
    * [restangular](https://github.com/mgonto/restangular)
    * [ngActiveResource](https://github.com/FacultyCreative/ngActiveResource)
    * [ember-data](https://github.com/emberjs/data)
