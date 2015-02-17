'use strict';

(function() {

    //---------------------------------------------------
    // Base Model
	// these properties and methods will be available to all model services
    //---------------------------------------------------

	var ERROR_INVALID_CONFIG 			= "Invalid Config";
	var ERROR_MISSING_PARAMS 			= "Missing Required Params";
	var ERROR_MODEL_DOES_NOT_EXIST 		= "Model does not exist";

	// virtual field
	var ERROR_VIRTUAL_FIELD_NAME 					= 'Name argument is required';
	var ERROR_VIRTUAL_FIELD_NAME_NOT_STRING 		= 'Name argument needs to be a string';
	var ERROR_VIRTUAL_FIELD_NAME_NOT_FIELD 			= 'Name argument is not in the object';
	var ERROR_VIRTUAL_FIELD_NAME_NOT_VIRTUAL_FIELD 	= 'Name argument is not a virtual field';
	var ERROR_VIRTUAL_FIELD_VALUE 					= 'Value argument is required';
	var ERROR_VIRTUAL_FIELD_VALUE_NOT_FUNCTION 		= 'Value argument needs to be a function';


	// angular services
	var $http;
	var $injector;
	var $q;

	// services
	var UtilService;
	var HttpResponseService;
	var TransformerService;

	// base active record
	var BaseActiveRecord;

	// settings
	var api_url;
	var apiEndpointTransformer = null;

	/**
	 * BaseModel
	 *
	 * @param _$http
	 * @param _$injector
	 * @param _$q
	 * @param _api_url
	 * @param _UtilService
	 * @param _HttpResponseService
	 * @param _TransformerService
	 * @param _BaseActiveRecord
	 * @constructor
	 */
	function BaseModel(_$http, _$injector, _$q, _api_url, _UtilService, _HttpResponseService, _TransformerService, _BaseActiveRecord) {

		// services & constants

		$http 					= _$http;
		$injector 				= _$injector;
		$q 						= _$q;
		api_url 				= _api_url;
		UtilService 			= _UtilService;
		HttpResponseService		= _HttpResponseService;
		TransformerService		= _TransformerService;
		BaseActiveRecord		= _BaseActiveRecord;

		// optional services
		try {
			apiEndpointTransformer = $injector.get('AngularCakePHPApiEndpointTransformer');
		} catch (e) {}

		// properties

		this.active_record_class;
		this.config = {
			api: api_url,
			api_endpoint: null,
			api_endpoint_auto: true
		};
	}

	BaseModel.$inject = ['$http', '$injector', '$q', 'AngularCakePHPApiUrl', 'UtilService', 'HttpResponseService', 'TransformerService', 'BaseActiveRecord'];

	//-----------------------------------------------
	// extend & new
	//-----------------------------------------------

	/**
	 * extend
	 *
	 * @param model
	 * @param active_record
	 * @returns {construct}
	 */
	BaseModel.prototype.extend = function(model, active_record) {

		if (_.isUndefined(model) || _.isUndefined(active_record)) {
			throw new Error(ERROR_MISSING_PARAMS);
		}

		// extend model
		model.prototype = Object.create(BaseModel.prototype);

		// create new model instance
		var instance = new model();

		// set instance properties
		instance.active_record_class = active_record;
		instance.config = _.merge(_.clone(this.config), instance.config);

		// if no endpoint is defined in model
		if (_.isNull(instance.config.api_endpoint)) {

			// create endpoint by converting class name to snake case
			instance.config.api_endpoint = _.snakeCase(instance.active_record_class.name);

			// if api endpoint transformer is provided, then use it to create the endpoint
			if (!_.isNull(apiEndpointTransformer)) {
				instance.config.api_endpoint = apiEndpointTransformer(instance.config.api_endpoint);
			}
		}

		// return model instance
		return instance;
	};

	/**
	 * new
	 *
	 * @param object data (data used to create a new active record)
	 * @returns object (new active record | empty object)
	 */
	BaseModel.prototype.new = function(data) {

		// format data
		if (_.isUndefined(data)) {
			data = {};
		}

		// create active record instance
		var instance = BaseActiveRecord.extend(this, data);

		// add associations (if provided)
		_.forEach(data, function(item, key) {
			if (_.isArray(item)) {
				var result_array = UtilService.getAssociationArray(item, key);
				if (!_.isEmpty(result_array)) {
					instance[key] = result_array;
				}
			} else if (_.isObject(item)) {
				var result_item = UtilService.getAssociation(item, key);
				if (result_item !== false) {
					instance[key] = result_item;
				}
			}
		}, this);

		// return new instance of child
		return instance;
	};



	//-----------------------------------------------
	// C.R.U.D
	//-----------------------------------------------

	/**
	 * index
	 * makes GET HTTP call to API
	 *
	 * @param object params (a list of url parameters to pass with the HTTP request)
	 * @returns promise HttpResponseService.handleIndexResponse
	 */
	BaseModel.prototype.index = function(params) {

		var self = this;

		return $q(function(resolve, reject) {

			var url = TransformerService.transformRequestUrl(self.config.api, self.config.api_endpoint, params);

			$http.get(url)
				.success(function(response, status, headers, config) {
					HttpResponseService.handleIndexResponse(resolve, reject, self, response, status, headers, config);
				})
				.error(function(response, status, headers, config) {
					HttpResponseService.handleErrorResponse(resolve, reject, self, response, status, headers, config);
				});
		});
	};

	/**
	 * view
	 * makes GET HTTP call to API with id
	 *
	 * @param id (unique id of the record you want to view)
	 * @param object params (a list of url parameters to pass with the HTTP request)
	 * @returns promise HttpResponseService.handleViewResponse
	 */
	BaseModel.prototype.view = function(id, params) {

		var self = this;

		// validate
		if (_.isNull(id) || _.isUndefined(id)) {
			throw new Error(ERROR_MISSING_PARAMS);
		}

		return $q(function(resolve, reject) {

			var url = TransformerService.transformRequestUrl(self.config.api, self.config.api_endpoint, params, id);

			$http.get(url)
				.success(function(response, status, headers, config) {
					HttpResponseService.handleViewResponse(resolve, reject, self, response, status, headers, config);
				})
				.error(function(response, status, headers, config) {
					HttpResponseService.handleErrorResponse(resolve, reject, self, response, status, headers, config);
				});
		});
	};

	/**
	 * add
	 * makes POST HTTP call to API
	 *
	 * @param object data (post data to be passed with HTTP POST request
	 * @returns promise HttpResponseService.handleAddResponse
	 */
	BaseModel.prototype.add = function(data) {

		var self = this;

		// validate
		if (_.isNull(data) || _.isUndefined(data)) {
			throw new Error(ERROR_MISSING_PARAMS);
		}

		return $q(function(resolve, reject) {

			var url = TransformerService.transformRequestUrl(self.config.api, self.config.api_endpoint);
			data = TransformerService.transformRequestData(data);

			$http.post(url, data)
				.success(function(response, status, headers, config) {
					HttpResponseService.handleAddResponse(resolve, reject, self, response, status, headers, config);
				})
				.error(function(response, status, headers, config) {
					HttpResponseService.handleErrorResponse(resolve, reject, self, response, status, headers, config);
				});
		});
	};

	/**
	 * edit
	 * makes PUT HTTP call to API with id
	 *
	 * @param id
	 * @param object data (data to be passed with HTTP PUT request)
	 * @returns promise HttpResponseService.handleEditResponse
	 */
	BaseModel.prototype.edit = function(id, data) {

		var self = this;

		// validate
		if (_.isNull(id) || _.isUndefined(id)) {
			throw new Error(ERROR_MISSING_PARAMS);
		}
		if (_.isNull(data) || _.isUndefined(data)) {
			throw new Error(ERROR_MISSING_PARAMS);
		}

		return $q(function(resolve, reject) {

			var url = TransformerService.transformRequestUrl(self.config.api, self.config.api_endpoint, null, id);
			data = TransformerService.transformRequestData(data);

			$http.put(url, data)
				.success(function(response, status, headers, config) {
					HttpResponseService.handleEditResponse(resolve, reject, self, response, status, headers, config);
				})
				.error(function(response, status, headers, config) {
					HttpResponseService.handleErrorResponse(resolve, reject, self, response, status, headers, config);
				});
		});
	};

	/**
	 * delete
	 * makes DELETE HTTP call to API with id
	 *
	 * @param id (unique id of the record you want to delete)
	 * @returns promise HttpResponseService.handleDeleteResponse
	 */
	BaseModel.prototype.delete = function(id) {

		var self = this;

		// validate
		if (_.isNull(id) || _.isUndefined(id)) {
			throw new Error(self.ERROR_MISSING_PARAMS);
		}

		return $q(function(resolve, reject) {

			var url = TransformerService.transformRequestUrl(self.config.api, self.config.api_endpoint, null, id);

			$http.delete(url)
				.success(function(response, status, headers, config) {
					HttpResponseService.handleDeleteResponse(resolve, reject, self, response, status, headers, config);
				})
				.error(function(response, status, headers, config) {
					HttpResponseService.handleErrorResponse(resolve, reject, self, response, status, headers, config);
				});
		});
	};

	/**
	 * validate
	 * Makes a POST HTTP call to API validation resource
	 *
	 * @param object active_record (active record to validate)
	 * @param array fields (array of fields to validate)
	 * @returns promise HttpResponseService.handleValidateResponse
	 */
	BaseModel.prototype.validate = function(active_record, fields) {

		var self = this;

		// validate
		if (_.isNull(active_record) || _.isUndefined(active_record)) {
			throw new Error(self.ERROR_MISSING_PARAMS);
		}

		return $q(function(resolve, reject) {

			// format get params
			var get_params = null;
			if (!_.isUndefined(fields)) {
				get_params = {fields: fields.join(',')};
			}

			// format url
			var url = TransformerService.transformRequestUrl(self.config.api, self.config.api_endpoint + '/validation', get_params);

			// post params
			var post_params = active_record;

			$http.post(url, post_params)
				.success(function(response, status, headers, config) {
					HttpResponseService.handleValidateResponse(resolve, reject, self, response, status, headers, config);
				})
				.error(function(response, status, headers, config) {
					HttpResponseService.handleValidateErrorResponse(resolve, reject, self, response, status, headers, config);
				});
		});
	};

	/**
	 * api
	 * Makes HTTP call to specified API endpoint
	 *
	 * @param string endpoint (endpoint to call)
	 * @param string http_method (HTTP method to use for call) (default: GET)
	 * @param object url_params (url params to pass with call)
	 * @param object post_params (post params to pass with call)
	 * @returns promise
	 */
	BaseModel.prototype.api = function(end_point, http_method, url_params, post_params) {

		var self = this;

		// param defaults
		if (_.isUndefined(http_method)) {
			http_method = 'GET';
		}
		if (_.isUndefined(url_params)) {
			url_params = {};
		}
		if (_.isUndefined(post_params)) {
			post_params = {};
		}

		// format params
		http_method = http_method.toUpperCase();

		// validate
		if (_.isNull(end_point) || _.isUndefined(end_point)) {
			throw new Error(self.ERROR_MISSING_PARAMS);
		}

		// format url params
		url_params = '';// TODO: url param conversion

		// format url
		var url = TransformerService.transformRequestUrl(self.config.api, self.config.api_endpoint + '/' + end_point, url_params);

		// http call params
		var http_params = {
			method: http_method,
			url: url
		};

		if (http_method === 'POST') {
			http_params.data = post_params;
		}

		// make call
		return $http(http_params);
	};

	angular.module('AngularCakePHP').service('AngularCakePHPBaseModel', BaseModel);
})();
