(function() {

    'use strict';

    //---------------------------------------------------
    // HttpResponse Service
    //---------------------------------------------------

    var HttpResponseService = function(
        TransformerService,
        $injector
    ) {

        /**
         * handleIndexResponse
         *
         * @param resolve
         * @param reject
         * @param model
         * @param response
         * @param status
         * @param headers
         * @param config
         */
        this.handleIndexResponse = function(resolve, reject, model, response, status, headers, config) {

            var data = TransformerService.transformResponseDataList(response.data, model);
            var angularCakePHPApiIndexResponseTransformer = $injector.get('AngularCakePHPApiIndexResponseTransformer');

            if (_.isFunction(angularCakePHPApiIndexResponseTransformer)) {
                angularCakePHPApiIndexResponseTransformer(resolve, reject, model, response, status, headers, config, data);
            } else {
                resolve({data: data});
            }
        };

        /**
         * handleViewResponse
         *
         * @param resolve
         * @param reject
         * @param model
         * @param response
         * @param status
         * @param headers
         * @param config
         */
        this.handleViewResponse = function(resolve, reject, model, response, status, headers, config) {

            var data = TransformerService.transformResponseData(response.data, model);
            var angularCakePHPApiViewResponseTransformer = $injector.get('AngularCakePHPApiViewResponseTransformer');

            if (_.isFunction(angularCakePHPApiViewResponseTransformer)) {
                angularCakePHPApiViewResponseTransformer(resolve, reject, model, response, status, headers, config, data);
            } else {
                resolve({data: data});
            }
        };

        /**
         * handleAddResponse
         *
         * @param resolve
         * @param reject
         * @param model
         * @param response
         * @param status
         * @param headers
         * @param config
         */
        this.handleAddResponse = function(resolve, reject, model, response, status, headers, config) {

            var data = TransformerService.transformResponseData(response.data, model);
            var angularCakePHPApiEditResponseTransformer = $injector.get('AngularCakePHPApiEditResponseTransformer');

            if (_.isFunction(angularCakePHPApiEditResponseTransformer)) {
                angularCakePHPApiEditResponseTransformer(resolve, reject, model, response, status, headers, config, data);
            } else {
                resolve({data: data, message: response.message});
            }
        };

        /**
         * handleEditResponse
         *
         * @param resolve
         * @param reject
         * @param model
         * @param response
         * @param status
         * @param headers
         * @param config
         */
        this.handleEditResponse = function(resolve, reject, model, response, status, headers, config) {

            var data = TransformerService.transformResponseData(response.data, model);
            var angularCakePHPApiAddResponseTransformer = $injector.get('AngularCakePHPApiAddResponseTransformer');

            if (_.isFunction(angularCakePHPApiAddResponseTransformer)) {
                angularCakePHPApiAddResponseTransformer(resolve, reject, model, response, status, headers, config, data);
            } else {
                resolve({data: data, message: response.message});
            }
        };

        /**
         * handleDeleteResponse
         *
         * @param resolve
         * @param reject
         * @param model
         * @param response
         * @param status
         * @param headers
         * @param config
         */
        this.handleDeleteResponse = function(resolve, reject, model, response, status, headers, config) {

            var angularCakePHPApiDeleteResponseTransformer = $injector.get('AngularCakePHPApiDeleteResponseTransformer');

            if (_.isFunction(angularCakePHPApiDeleteResponseTransformer)) {
                angularCakePHPApiDeleteResponseTransformer(resolve, reject, model, response, status, headers, config);
            } else {
                resolve({message: response.message});
            }
        };

        /**
         * handleValidateResponse
         *
         * @param resolve
         * @param reject
         * @param model
         * @param response
         * @param status
         * @param headers
         * @param config
         */
        this.handleValidateResponse = function(resolve, reject, model, response, status, headers, config) {

            var angularCakePHPApiValidateResponseTransformer = $injector.get('AngularCakePHPApiValidateResponseTransformer');

            if (_.isFunction(angularCakePHPApiValidateResponseTransformer)) {
                angularCakePHPApiValidateResponseTransformer(resolve, reject, model, response, status, headers, config);
            } else {
                resolve({message: response.message});
            }
        };

        /**
         * handleValidateErrorResponse
         *
         * @param resolve
         * @param reject
         * @param model
         * @param response
         * @param status
         * @param headers
         * @param config
         */
        this.handleValidateErrorResponse = function(resolve, reject, model, response, status, headers, config) {

            var angularCakePHPApiValidateErrorResponseTransformer = $injector.get('AngularCakePHPApiValidateErrorResponseTransformer');

            if (_.isFunction(angularCakePHPApiValidateErrorResponseTransformer)) {
                angularCakePHPApiValidateErrorResponseTransformer(resolve, reject, model, response, status, headers, config);
            } else {
                reject({data: response.data, message: response.message});
            }
        };

        /**
         * handleErrorResponse
         *
         * @param resolve
         * @param reject
         * @param model
         * @param response
         * @param status
         * @param headers
         * @param config
         */
        this.handleErrorResponse = function(resolve, reject, model, response, status, headers, config) {

            var angularCakePHPApiErrorResponseTransformer = $injector.get('AngularCakePHPApiErrorResponseTransformer');

            if (_.isFunction(angularCakePHPApiErrorResponseTransformer)) {
                angularCakePHPApiErrorResponseTransformer(resolve, reject, model, response, status, headers, config);
            } else {
                if (_.isNull(response)) {
                    return true;
                }
                reject({data: response.data, message: response.message});
            }
        };
    };

    HttpResponseService.$inject = [
        'TransformerService',
        '$injector'
    ];

    angular.module('AngularCakePHP').service('HttpResponseService', HttpResponseService);

})();
