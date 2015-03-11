'use strict';

(function () {

    //-------------------------
    // App Settings
    //-------------------------

    angular.module('App')
        .value('AngularCakePHPApiUrl', 'http://www.google.com')
        .value('AngularCakePHPApiEndpointTransformer', function(value) {
            return value +'s';
        })
        .value('AngularCakePHPUrlParamTransformer', function(params) {
            return ['a=B','c=D'];
        });

})();
