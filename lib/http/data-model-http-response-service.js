'use strict';

(function() {

	//---------------------------------------------------
	// DataModelHttpResponse Service
	//---------------------------------------------------

	var DataModelHttpResponseService = function(TransformerService) {


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
			var result = TransformerService.transformResponseDataList(response.data, model);
			resolve(result);
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
			var result = TransformerService.transformResponseData(response.data, model);
			resolve(result);
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
			resolve(response.message);
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
			resolve(response.message);
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
			resolve(response.message);
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
			resolve(response);
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
			reject(response);
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
			reject(response.message);
		};
	};

	DataModelHttpResponseService.$inject = ['DataModelTransformerService'];

	angular.module('DataModel').service('DataModelHttpResponseService', DataModelHttpResponseService);

})();
