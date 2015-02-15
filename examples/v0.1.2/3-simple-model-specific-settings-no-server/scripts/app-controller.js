"use strict";

(function () {


	//-------------------------
	// App Controller
	//-------------------------

	var AppController = function ($scope, UserModel) {

		this.users = [];
		this.new_user = UserModel.new();

		$scope.api_endpoint = UserModel.config.api_endpoint;
	};

	AppController.$inject = ['$scope', 'UserModel'];

	angular.module('App').controller('AppController', AppController);

})();