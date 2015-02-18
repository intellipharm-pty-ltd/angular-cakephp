(function() {

    'use strict';

	//---------------------------------------------------
	// HttpResponse Service
	//---------------------------------------------------

	var HttpResponseService = function(TransformerService) {


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
			resolve({data: data});
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
			resolve({data: data});
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
			resolve({message: response.message, data: response.data});
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
			resolve({message: response.message});
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
			resolve({message: response.message});
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
			resolve({message: response.message});
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
			reject({data: response.data, message: response.message});
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
			reject({message: response.message});
		};
	};

	HttpResponseService.$inject = ['TransformerService'];

	angular.module('AngularCakePHP').service('HttpResponseService', HttpResponseService);

})();
