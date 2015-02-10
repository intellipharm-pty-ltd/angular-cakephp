'use strict';

(function() {

	//---------------------------------------------------
	// DataModelTransformer Service
	//---------------------------------------------------

	var DataModelTransformerService = function(HttpQueryBuildService) {

		var self = this;

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
			var params_array = [];

			if (!_.isUndefined(params) && !_.isNull(params) && !_.isEmpty(params)) {
				_.forEach(params, function(item, key) {
					if (key === 'contain') {
						params_array.push(HttpQueryBuildService.build(item, 'contain'));
					} else if (key && item) {
						params_array.push(key + '=' + item);
					}
				});
			}

			var params_str = '';
			if (params_array.length > 0) {
				params_str = '?' + params_array.join('&');
			}


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
			var d = _.clone(data, true);

			if (_.has(d, 'model')) {
				delete d.model;
			}

			// remove model for all sub items too
			_.forEach(d, function(item, key) {
				if (_.isArray(item)) {
					_.forEach(item, function(i) {
						i = this.transformRequestData(i);
					}, this);
				} else if (_.isObject(item)) {
					item = this.transformRequestData(item);
				}
			}, this);

			return d;
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

	DataModelTransformerService.$inject = ['HttpQueryBuildService'];

	angular.module('DataModel').service('DataModelTransformerService', DataModelTransformerService);

})();
