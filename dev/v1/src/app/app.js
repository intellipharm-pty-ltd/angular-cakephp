import angular from 'angular';
import _ from 'lodash';
import pluralize from 'blakeembrey/pluralize';
import { RestApi, ActiveRecord } from 'dist/angular-cakephp';

import controller from 'app/app-controller';

//--------------------------------------
// App module
//--------------------------------------

var module = angular.module( 'ExampleV1', [] );

module.controller( 'AppController', controller );

//--------------------------------------
// run
//--------------------------------------

var run = function( $http ) {

	// Rest Api
	RestApi.http = $http;
	RestApi.generatePath = true;
	RestApi.pathGenerator = pluralize;
	RestApi.hostname = "http://localhost/loyaltyone-api/";

	// Active Record
	ActiveRecord.mapData = true;

};

run.$inject = [ '$http' ];

module.run( run );

//--------------------------------------
// bootstrap AngularJS
//--------------------------------------

angular.element( document ).ready( function() {
	angular.bootstrap( document.body, [ module.name ], {
		strictDi: true
	});
});
