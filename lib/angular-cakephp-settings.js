(function() {
    'use strict';

    angular.module('AngularCakePHP')
        .value('AngularCakePHPApiUrl', '')
        .value('AngularCakePHPTimestamps', true) // optional
        .value('AngularCakePHPApiEndpointTransformer', null) // optional
        .value('AngularCakePHPUrlParamTransformer', null) // optional
        .value('AngularCakePHPApiIndexResponseTransformer', null) // optional
        .value('AngularCakePHPApiViewResponseTransformer', null) // optional
        .value('AngularCakePHPApiEditResponseTransformer', null) // optional
        .value('AngularCakePHPApiAddResponseTransformer', null) // optional
        .value('AngularCakePHPApiDeleteResponseTransformer', null) // optional
        .value('AngularCakePHPApiValidateResponseTransformer', null) // optional
        .value('AngularCakePHPApiValidateErrorResponseTransformer', null) // optional
        .value('AngularCakePHPApiErrorResponseTransformer', null) // optional
    ;
})();
