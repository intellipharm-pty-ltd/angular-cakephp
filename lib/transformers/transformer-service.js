(function() {

    'use strict';

    //---------------------------------------------------
    // Transformer Service
    //---------------------------------------------------

    var TransformerService = function($injector) {

        var urlParamTransformer = null;

        // optional services
        try {
            urlParamTransformer = $injector.get('AngularCakePHPUrlParamTransformer');
        } catch (e) {}

        /**
         * transformRequestUrl
         *
         * @param api
         * @param api_endpoint
         * @param params
         * @param id
         * @returns {string}
         */
        this.transformRequestUrl = function(api, api_endpoint, params, id) {

            // create url params array
            var params_array = [];

            if (!_.isUndefined(params) && !_.isNull(params) && !_.isEmpty(params)) {

                // transform url params (custom)
                if (!_.isNull(urlParamTransformer)) {
                    params_array = urlParamTransformer(params);
                }

                // transform url params (default)
                else {
                    _.forEach(params, function(item, key) {

                        if (key && item) {
                            params_array.push(key + '=' + item);
                        }
                    });
                }
            }

            // create url params string
            var params_str = '';
            if (_.isArray(params_array) && params_array.length > 0) {
                params_str = '?' + params_array.join('&');
            } else if (params_array.length > 0) {
                params_str = '?' + params_array;
            }

            // create request url
            var id_str = !_.isUndefined(id) && !_.isNull(id) ? '/' + id : '';
            var result = api + '/' + api_endpoint + id_str + params_str;
            result = result.replace(/([^:]\/)\/+/g, '$1'); // replace double slashes (exluding ://)
            return result;
        };

        /**
         * transformRequestData
         *
         * @param data
         * @returns {*}
         */
        this.transformRequestData = function(data) {
            return data;
        };

        /**
         * transformResponseDataList
         *
         * @param response
         * @param model
         * @returns {Array}
         */
        this.transformResponseDataList = function(response, model) {
            var result = [];
            _.forEach(response, function(item) {
                result.push(this.transformResponseData(item, model));
            }, this);
            return result;
        };

        /**
         * transformResponseData
         *
         * @param data
         * @param model
         * @returns {Array}
         */
        this.transformResponseData = function(data, model) {

            // format item
            _.merge(data, data[model.active_record_class.name]);
            delete data[model.active_record_class.name];

            // create active record instance
            return model.new(data);
        };
    };

    TransformerService.$inject = ['$injector'];

    angular.module('AngularCakePHP').service('TransformerService', TransformerService);

})();
