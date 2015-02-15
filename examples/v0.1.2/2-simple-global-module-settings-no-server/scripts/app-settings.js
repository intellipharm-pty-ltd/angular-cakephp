"use strict";

(function () {

	//-------------------------
	// App Settings
	//-------------------------

	angular.module('App')
		.value('AngularCakePHPApiUrl', "http://www.google.com")
		.value('AngularCakePHPApiEndpoint', function(value) {
			return value +"s";
		});

})();