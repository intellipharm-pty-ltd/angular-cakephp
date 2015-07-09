'use strict';

(function () {

    //-------------------------
    // App Controller
    //-------------------------

    var AppController = function ($scope, UserModel) {

        this.users = [];
        this.new_user = UserModel.new();

        $scope.api = UserModel.config.api;
        $scope.api_endpoint = UserModel.config.api_endpoint;

        /**
         * logHttpCallUrlParams
         */
        this.logHttpCallUrlParams = function() {
            var params = {a: 'b', c: 'd'};
            UserModel.index(params);
        };
    };

    AppController.$inject = ['$scope', 'UserModel'];

    angular.module('App').controller('AppController', AppController);

})();
