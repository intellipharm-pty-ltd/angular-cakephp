(function() {

    'use strict';

    //---------------------------------------------------
    // HttpResponse Service
    //---------------------------------------------------

    var HttpResponseService = function(
        TransformerService,
        AngularCakePHPApiIndexResponseTransformer,
        AngularCakePHPApiViewResponseTransformer,
        AngularCakePHPApiEditResponseTransformer,
        AngularCakePHPApiAddResponseTransformer,
        AngularCakePHPApiDeleteResponseTransformer,
        AngularCakePHPApiValidateResponseTransformer,
        AngularCakePHPApiValidateErrorResponseTransformer,
        AngularCakePHPApiErrorResponseTransformer
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

            if (_.isFunction(AngularCakePHPApiIndexResponseTransformer)) {
                AngularCakePHPApiIndexResponseTransformer(resolve, reject, model, response, status, headers, config);
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

            if (_.isFunction(AngularCakePHPApiViewResponseTransformer)) {
                AngularCakePHPApiViewResponseTransformer(resolve, reject, model, response, status, headers, config);
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
            if (_.isFunction(AngularCakePHPApiEditResponseTransformer)) {
                AngularCakePHPApiEditResponseTransformer(resolve, reject, model, response, status, headers, config);
            } else {
                resolve({message: response.message, data: response.data});
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
            if (_.isFunction(AngularCakePHPApiAddResponseTransformer)) {
                AngularCakePHPApiAddResponseTransformer(resolve, reject, model, response, status, headers, config);
            } else {
                resolve({message: response.message});
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
            if (_.isFunction(AngularCakePHPApiDeleteResponseTransformer)) {
                AngularCakePHPApiDeleteResponseTransformer(resolve, reject, model, response, status, headers, config);
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
            if (_.isFunction(AngularCakePHPApiValidateResponseTransformer)) {
                AngularCakePHPApiValidateResponseTransformer(resolve, reject, model, response, status, headers, config);
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
            if (_.isFunction(AngularCakePHPApiValidateErrorResponseTransformer)) {
                AngularCakePHPApiValidateErrorResponseTransformer(resolve, reject, model, response, status, headers, config);
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
            if (_.isFunction(AngularCakePHPApiErrorResponseTransformer)) {
                AngularCakePHPApiIndexResponseTransformer(resolve, reject, model, response, status, headers, config);
            } else {
                reject({data: response.data, message: response.message});
            }
        };
    };

    HttpResponseService.$inject = [
        'TransformerService',
        'AngularCakePHPApiIndexResponseTransformer',
        'AngularCakePHPApiViewResponseTransformer',
        'AngularCakePHPApiEditResponseTransformer',
        'AngularCakePHPApiAddResponseTransformer',
        'AngularCakePHPApiDeleteResponseTransformer',
        'AngularCakePHPApiValidateResponseTransformer',
        'AngularCakePHPApiValidateErrorResponseTransformer',
        'AngularCakePHPApiErrorResponseTransformer'
    ];

    angular.module('AngularCakePHP').service('HttpResponseService', HttpResponseService);

})();
