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

	var $http;
	var $injector;
	var $q;
	var UtilService;
	var HttpResponseService;
	var TransformerService;
	var DataModelApiUrl;
	var BaseActiveRecord;

	/**
	 * BaseModel
	 *
	 * @param _$http
	 * @param _$injector
	 * @param _$q
	 * @param _DataModelApiUrl
	 * @param DataModelUtilService
	 * @param DataModelHttpResponseService
	 * @constructor
	 */
	function BaseModel(_$http, _$injector, _$q, _DataModelApiUrl, DataModelUtilService, DataModelHttpResponseService, DataModelTransformerService, _BaseActiveRecord) {

		// services & constants

		$http 					= _$http;
		$injector 				= _$injector;
		$q 						= _$q;
		DataModelApiUrl 		= _DataModelApiUrl;
		UtilService 			= DataModelUtilService;
		HttpResponseService		= DataModelHttpResponseService;
		TransformerService		= DataModelTransformerService;
		BaseActiveRecord		= _BaseActiveRecord;

		// properties

		this.active_record_class;
		this.config = {
			api: DataModelApiUrl,
			api_endpoint: null,
			api_endpoint_auto: true
		};
	}

	BaseModel.$inject = ['$http', '$injector', '$q', 'DataModelApiUrl', 'DataModelUtilService', 'DataModelHttpResponseService', 'DataModelTransformerService', 'BaseActiveRecord'];

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

		if (_.isNull(instance.config.api_endpoint) && instance.config.api_endpoint_auto) {
			instance.config.api_endpoint = pluralize(_.snakeCase(instance.active_record_class.name));
		}

		// return model instance
		return instance;
	};

	/**
	 * for testing
	 * @param num
	 * @returns {*}
	 */
	BaseModel.prototype.modelTestingMethod = function(num) {
		return num + 10;
	};

	/**
	 * new
	 *
	 * @param data
	 * @returns {construct.active_record_class}
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
	 *
	 * @param params
	 * @returns {*}
	 */
	BaseModel.prototype.index = function(params) {

		var self = this;

		// validate
		if (!_.has(this.config, 'api_endpoint') || _.isNull(this.config.api_endpoint) || _.isUndefined(this.config.api_endpoint)) {
			throw new Error(ERROR_INVALID_CONFIG);
		}

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
	 *
	 * @param id
	 * @param params
	 * @returns {*}
	 */
	BaseModel.prototype.view = function(id, params) {

		var self = this;

		// validate
		if (!_.has(this.config, 'api_endpoint') || _.isNull(this.config.api_endpoint) || _.isUndefined(this.config.api_endpoint)) {
			throw new Error(ERROR_INVALID_CONFIG);
		}
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
	 *
	 * @param data
	 * @returns {Promise}
	 */
	BaseModel.prototype.add = function(data) {

		var self = this;

		// validate
		if (!_.has(this.config, 'api_endpoint') || _.isNull(this.config.api_endpoint) || _.isUndefined(this.config.api_endpoint)) {
			throw new Error(ERROR_INVALID_CONFIG);
		}
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
	 *
	 * @param id
	 * @param data
	 * @returns {Promise}
	 */
	BaseModel.prototype.edit = function(id, data) {

		var self = this;

		// validate
		if (!_.has(this.config, 'api_endpoint') || _.isNull(this.config.api_endpoint) || _.isUndefined(this.config.api_endpoint)) {
			throw new Error(ERROR_INVALID_CONFIG);
		}
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
	 *
	 * @param id
	 * @returns {Promise}
	 */
	BaseModel.prototype.delete = function(id) {

		var self = this;

		// validate
		if (!_.has(this.config, 'api_endpoint') || _.isNull(this.config.api_endpoint) || _.isUndefined(this.config.api_endpoint)) {
			throw new Error(self.ERROR_INVALID_CONFIG);
		}
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

	/*
	 * validate
	 *
	 * @param active_record
	 * @param fields
	 * @returns {Promise}
	 */
	BaseModel.prototype.validate = function(active_record, fields) {

		var self = this;

		// validate
		if (!_.has(this.config, 'api_endpoint') || _.isNull(this.config.api_endpoint) || _.isUndefined(this.config.api_endpoint)) {
			throw new Error(self.ERROR_INVALID_CONFIG);
		}
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
	 * custom api action call
	 *
	 * @param action
	 * @param params
	 * @param http_method
	 * @returns {Promise}
	 */
	BaseModel.prototype.api = function(action, params, http_method) {

		var self = this;

		// param defaults
		if (_.isUndefined(http_method)) {
			http_method = 'GET';
		}
		if (_.isUndefined(params)) {
			params = {};
		}

		// format params
		http_method = http_method.toUpperCase();

		// validate
		if (!_.has(this.config, 'api_endpoint') || _.isNull(this.config.api_endpoint) || _.isUndefined(this.config.api_endpoint)) {
			throw new Error(self.ERROR_INVALID_CONFIG);
		}
		if (_.isNull(action) || _.isUndefined(action)) {
			throw new Error(self.ERROR_MISSING_PARAMS);
		}

		// format get params
		var get_params = null;
		var post_params = [];
		if (http_method === 'GET') {
			get_params = []; // TODO: convert params to url args
		} else {
			post_params = params;
		}

		// format url
		var url = TransformerService.transformRequestUrl(self.config.api, self.config.api_endpoint + '/' + action, get_params);

		return $http({
			url: url,
			data: post_params,
			method: http_method
		});
	};

	angular.module('DataModel').service('BaseModel', BaseModel);
})();
