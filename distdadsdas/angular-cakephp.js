'use strict';

(function() {

	angular.module('AngularCakePHP')
		.value('AngularCakePHPApiUrl', 'http://example.com/api')
		.value('AngularCakePHPGenerateEndPoint', false);

})();
/*!
 * angular-cakephp v0.1.2
 * http://intellipharm.com/
 *
 * Copyright 2015 Intellipharm
 *
 * Date: 2015-02-10T13:35Z
 *
 */
'use strict';

(function() {

	//----------------------------------
	// AngularCakePHP
	//----------------------------------

	angular.module('AngularCakePHP', []);
})();

'use strict';

(function() {

    //---------------------------------------------------
    // Base Active Record
	// these properties and methods will be available to all model services
    //---------------------------------------------------

    // extend errors
    var ERROR_MISSING_PARAMS 			= "Missing Required Params";

	// virtual field errors
	var ERROR_VIRTUAL_FIELD_NAME 					= 'Name argument is required';
	var ERROR_VIRTUAL_FIELD_NAME_NOT_STRING 		= 'Name argument needs to be a string';
	var ERROR_VIRTUAL_FIELD_NAME_NOT_FIELD 			= 'Name argument is not in the object';
	var ERROR_VIRTUAL_FIELD_NAME_NOT_VIRTUAL_FIELD 	= 'Name argument is not a virtual field';
	var ERROR_VIRTUAL_FIELD_VALUE 					= 'Value argument is required';
	var ERROR_VIRTUAL_FIELD_VALUE_NOT_FUNCTION 		= 'Value argument needs to be a function';

	//var model;

	/**
	 * BaseActiveRecord
	 *
	 * @constructor
	 */
	function BaseActiveRecord() {
		this.model;
	}

	BaseActiveRecord.$inject = [];

	/**
	 * extend
	 *
	 * @param model
	 * @param active_record
	 * @returns {construct}
	 */
	BaseActiveRecord.prototype.extend = function(model, data) {

		if (_.isUndefined(model) || !_.has(model, 'active_record_class')  || _.isUndefined(model.active_record_class) || _.isUndefined(data)) {
			throw new Error(ERROR_MISSING_PARAMS);
		}

		// extend active record
		model.active_record_class.prototype = Object.create(BaseActiveRecord.prototype);

		// create new active record instance
		//var instance = active_record;
		var instance = new model.active_record_class(data);

		// set instance properties
		instance.model = model;

		// return active record instance
		return instance;
	};

	/**
	 * save
	 *
	 * @returns {Promise}
	 */
	BaseActiveRecord.prototype.save = function() {

		if (this.id) {
			return this.model.edit(this.id, this);
		}

		return this.model.add(this);
	};

	/**
	 * new
	 *
	 * @returns {Promise}
	 */
	BaseActiveRecord.prototype.new = function(data) {
		return this.model.new(data);
	};

	/**
	 * delete
	 *
	 * @param active_record
	 * @returns {Promise}
	 */
	BaseActiveRecord.prototype.delete = function() {
		return this.model.delete(this.id);
	};

	/**
	 * delete
	 *
	 * @param fields
	 * @returns {Promise}
	 */
	BaseActiveRecord.prototype.validate = function(fields) {
		return this.model.validate(this, fields);
	};

	/**
	 * getClassName
	 *
	 * @returns {Promise}
	 */
	BaseActiveRecord.prototype.getClassName = function() {
		return this.model && this.model.active_record_class ? this.model.active_record_class.name : null;
	};

	/**
	 * virtualField
	 *
	 * @param name
	 * @param valueFn
	 * @returns {construct}
	 */
	BaseActiveRecord.prototype.virtualField = function(name, valueFn) {
		var self = this,
			virtualValue;

		if (!name) {
			throw new Error(ERROR_VIRTUAL_FIELD_NAME);
		}

		if (typeof name !== 'string') {
			throw new Error(ERROR_VIRTUAL_FIELD_NAME_NOT_STRING);
		}


		if (!valueFn) {
			throw new Error(ERROR_VIRTUAL_FIELD_VALUE);
		}

		if (typeof valueFn !== 'function') {
			throw new Error(ERROR_VIRTUAL_FIELD_VALUE_NOT_FUNCTION);
		}

		Object.defineProperty(this, name, {
			enumerable: false,
			configurable: false,
			get: function() {
				return virtualValue;
			},
			set: function(value) {
				virtualValue = valueFn.apply(this);
				return virtualValue;
			}
		});

		// this doesn't work in karma for some reason
		// this also blocks associations, so we need to find a better solution
		/*var observer = new ObjectObserver(this);
		observer.open(function(added, removed, changed, getOldValueFn) {
			self.virtualFieldUpdate(name);
		});*/

		// trigger the setter
		this.virtualFieldUpdate(name);

		return this;
	};

	/**
	 * virtualFieldUpdate
	 *
	 * When the field is set manually it triggers the set function defined in virtualField.
	 * We can set it to blank and then it triggers the valueFn to set the value
	 *
	 * @param name
	 * @returns this
	 */
	BaseActiveRecord.prototype.virtualFieldUpdate = function(name) {
		if (!name) {
			throw new Error(ERROR_VIRTUAL_FIELD_NAME);
		}

		if (typeof name !== 'string') {
			throw new Error(ERROR_VIRTUAL_FIELD_NAME_NOT_STRING);
		}

		if (!name in this) {
			throw new Error(ERROR_VIRTUAL_FIELD_NAME_NOT_FIELD);
		}

		if (this.propertyIsEnumerable(name)) {
			throw new Error(ERROR_VIRTUAL_FIELD_NAME_NOT_VIRTUAL_FIELD);
		}

		this[name] = '';

		return this;
	};

	angular.module('AngularCakePHP').service('BaseActiveRecord', BaseActiveRecord);
})();

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
	var generate_endpoint;

	/**
	 * BaseModel
	 *
	 * @param _$http
	 * @param _$injector
	 * @param _$q
	 * @param _api_url
	 * @param _generate_endpoint
	 * @param _UtilService
	 * @param _HttpResponseService
	 * @param _TransformerService
	 * @param _BaseActiveRecord
	 * @constructor
	 */
	function BaseModel(_$http, _$injector, _$q, _api_url, _generate_endpoint, _UtilService, _HttpResponseService, _TransformerService, _BaseActiveRecord) {

		// services & constants

		$http 					= _$http;
		$injector 				= _$injector;
		$q 						= _$q;
		api_url 				= _api_url;
		generate_endpoint 		= _generate_endpoint;
		UtilService 			= _UtilService;
		HttpResponseService		= _HttpResponseService;
		TransformerService		= _TransformerService;
		BaseActiveRecord		= _BaseActiveRecord;

		// properties

		this.active_record_class;
		this.config = {
			api: api_url,
			api_endpoint: null,
			api_endpoint_auto: true
		};
	}

	BaseModel.$inject = ['$http', '$injector', '$q', 'AngularCakePHPApiUrl', 'AngularCakePHPGenerateEndPoint', 'UtilService', 'HttpResponseService', 'TransformerService', 'BaseActiveRecord'];

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

		// if endpoint is not provided then create using pluralize TODO: test
		if (_.isNull(instance.config.api_endpoint) && instance.config.api_endpoint_auto) {
			instance.config.api_endpoint = pluralize(_.snakeCase(instance.active_record_class.name));
		}

		// return model instance
		return instance;
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

		console.log(this.config.api_endpoint);

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

	/**
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

	angular.module('AngularCakePHP').service('AngularCakePHPBaseModel', BaseModel);
})();

'use strict';

(function() {

	//----------------------------------
	// HttpQueryBuild Service
	//----------------------------------

	var HttpQueryBuildService = function() {

		/**
		 * build
		 *
		 * @param data
		 * @param key
		 * @returns {string}
		 */
		this.build = function(data, key) {
			var key_str = !_.isUndefined(key) ? key : "";
			var result = buildProcess(data, key_str, "");

			return result.substring(1, result.length);
		};

		/**
		 * buildProcess
		 *
		 * @param data
		 * @param key_str
		 * @param result
		 * @param caseA
		 * @returns {*}
		 */
		var buildProcess = function(data, key_str, result, caseA) {
			caseA = _.isUndefined(caseA) ? false : caseA;

			if (typeof data === 'string') {
				data = data.split(',');
			}

			for (var key in data) {
				if (_.isArray(data[key])) {

					// TODO: make this part recursive
					for (var i=0; i<data[key].length; i++) {

						if (_.isObject(data[key][i])) {
							for (var sub_key in data[key][i]) {
								result += "&" + key_str + '[' + key + '][' + sub_key + ']=' + data[key][i][sub_key];
							}
						} else {
							result += "&" + key_str + '[' + key + '][' + i + ']=' + data[key][i];
						}
					}
				} else if (_.isArray(data) && _.isObject(data[key])) {
					result = buildProcess(data[key], key_str, result);
				} else if (_.isObject(data[key])) {
					result += "&" + key_str + '['+key+']';
					result = buildProcess(data[key], key_str, result, true);
				} else {
					if (caseA) {
						result += '['+key+']=' + data[key];
					}else {
						result += "&" + key_str + '['+key+']=' + data[key];
					}
				}
			}
			return result;
		};
	};

	angular.module('AngularCakePHP').service('HttpQueryBuildService', HttpQueryBuildService);

})();
'use strict';

(function() {

	//---------------------------------------------------
	// HttpRequest Service
	//---------------------------------------------------

	var HttpRequestService = function($q) {

		/**
		 * prepareRequest
		 */
		this.prepareRequest = function(data) {

			var result = [];
			_(response.data).forEach(function(item) {

				// format response data
				_.merge(item, item[model.active_record_class.name]);
				delete item[model.active_record_class.name];

				// create active record instance
				result.push(model.new(item));
			});
			resolve(result);
		};
	};

	HttpRequestService.$inject = ['$q'];

	angular.module('AngularCakePHP').service('HttpRequestService', HttpRequestService);

})();

'use strict';

(function() {

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

'use strict';

(function() {

	//---------------------------------------------------
	// Transformer Service
	//---------------------------------------------------

	var TransformerService = function(HttpQueryBuildService) {

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

	TransformerService.$inject = ['HttpQueryBuildService'];

	angular.module('AngularCakePHP').service('TransformerService', TransformerService);

})();

'use strict';

(function() {

	//---------------------------------------------------
	// Util Service
	//---------------------------------------------------

	var UtilService = function($injector) {

		var self = this;

		this.ERROR_MODEL_DOES_NOT_EXIST = 'Model does not exist';
		this.ERROR_NO_DATA 				= 'No Data';

		/**
		 * getAssociationArray
		 *
		 * @param data
		 * @param key
		 * @returns {Array}
		 */
		this.getAssociationArray = function(data, key) {
			var result = [];
			var model_class = key + 'Model';
			_.forEach(data, function(item) {
				var result_item = this.getAssociation(item, key, model_class);
				if (result_item !== false) {
					result.push(result_item);
				}
			}, this);
			return result;
		};

		/**
		 * getAssociation
		 *
		 * @param data
		 * @param key
		 * @param model_class
		 * @returns {*}
		 */
		this.getAssociation = function(data, key, model_class) {

			// if data is a number then it is part of a list of association id's so return as is
			if (_.isNumber(data)) {
				return data;
			}

			if (_.isUndefined(model_class)) {
				model_class = key + 'Model';
			}

			// return false if data.id is null
			if (_.has(data, 'id') && _.isNull(data.id)) {
				console.error(self.ERROR_NO_DATA + ': ' + model_class);
				return false;
			}

			try {
				var model = $injector.get(model_class);
				var result = model.new(data);
				return result;
			} catch (error) {
				console.error(self.ERROR_MODEL_DOES_NOT_EXIST + ': ' + model_class);
				return false;
			}
		};
	};

	UtilService.$inject = ['$injector'];

	angular.module('AngularCakePHP').service('UtilService', UtilService);

})();
