System.register(['lodash', '../angular-cakephp'], function (_export) {
    'use strict';

    var _, ActiveRecord, MESSAGE_HOSTNAME_AND_PATH_REQURIED, MESSAGE_HTTP_REQUIRED, MESSAGE_ID_IS_REQURIED, MESSAGE_INVALID_HTTP_SERVICE, RestApi;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_lodash) {
            _ = _lodash['default'];
        }, function (_angularCakephp) {
            ActiveRecord = _angularCakephp.ActiveRecord;
        }],
        execute: function () {
            MESSAGE_HOSTNAME_AND_PATH_REQURIED = 'Please configure an API hostname & path before making a request';
            MESSAGE_HTTP_REQUIRED = 'Please provide HTTP service';
            MESSAGE_ID_IS_REQURIED = 'Please provide an ID with request';
            MESSAGE_INVALID_HTTP_SERVICE = 'http is invalid';

            /**
             * Class RestApi
             */

            RestApi = (function () {
                function RestApi() {
                    _classCallCheck(this, RestApi);
                }

                // defaults

                _createClass(RestApi, null, [{
                    key: 'path',

                    /**
                     * path
                     * API path to use in HTTP requests
                     * if no path is available & active record class is set then pathGenerator will be used to generate API path
                     */
                    value: function path() {
                        var active_record_class = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

                        if (!_.isNull(this.pathGenerator) && !_.isNull(active_record_class)) {
                            var _name = '';

                            if (active_record_class.getClassName) {
                                _name = active_record_class.getClassName();
                                // fallback if not a proper active record class
                            } else {
                                    _name = active_record_class.constructor.name !== 'Function' ? active_record_class.constructor.name : !_.isUndefined(active_record_class.name) ? active_record_class.name : null;
                                }

                            if (!_.isNull(_name)) {
                                this._path = this.pathGenerator(_.snakeCase(_name));
                            }
                        }

                        return this._path;
                    }

                    /**
                     * url
                     */
                }, {
                    key: 'url',
                    value: function url() {
                        var active_record_class = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
                        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                        if (!_.isNull(this._url) && _.isNull(active_record_class) && !_.has(config, 'path')) {
                            return this._url;
                        }

                        var hostname = _.has(config, 'hostname') ? config.hostname : this.hostname;

                        // if config has path then use that
                        // else try and set oath using active_record_class, then get path
                        var path = _.has(config, 'path') ? config.path : this.path(active_record_class);

                        if (_.isNull(hostname) || _.isNull(path)) {
                            throw new Error(MESSAGE_HOSTNAME_AND_PATH_REQURIED);
                        }

                        // create url from hostname and path
                        this._url = hostname + path;

                        return this._url;
                    }

                    /**
                     * index
                     *
                     * @param  {ActiveRecord Class} active_record_class
                     * @param  {Object} request_config = {}
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: 'index',
                    value: function index(active_record_class) {
                        var request_config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                        // request config
                        request_config.method = 'GET';

                        // request ...
                        return this.request(active_record_class, request_config);
                    }

                    /**
                     * view
                     *
                     * @param  {ActiveRecord Class} active_record_class
                     * @param  {Integer} id
                     * @param  {Object} request_config = {}
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: 'view',
                    value: function view(active_record_class, id) {
                        var request_config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                        if (_.isNull(id) || _.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_IS_REQURIED);
                        }

                        // request config
                        request_config.method = 'GET';
                        request_config.sub_path = _.has(request_config, 'sub_path') ? id + '/' + request_config.sub_path : id;

                        // request ...
                        return this.request(active_record_class, request_config);
                    }

                    /**
                     * add
                     *
                     * @param  {ActiveRecord Class} active_record_class
                     * @param  {Object} request_config = {}
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: 'add',
                    value: function add(active_record_class) {
                        var request_config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                        // request config
                        request_config.method = 'POST';

                        // request ...
                        return this.request(active_record_class, request_config);
                    }

                    /**
                     * edit
                     *
                     * @param  {ActiveRecord Class} active_record_class
                     * @param  {Integer} id
                     * @param  {Object} request_config = {}
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: 'edit',
                    value: function edit(active_record_class, id) {
                        var request_config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                        if (_.isNull(id) || _.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_IS_REQURIED);
                        }

                        // request config
                        request_config.method = 'PUT';
                        request_config.sub_path = this.formatSubPath(id, request_config);

                        // request ...
                        return this.request(active_record_class, request_config);
                    }

                    /**
                     * formatSubPath
                     *
                     * @param  {Integer}      id
                     * @param  {object}      config
                     * @return {String}
                     */
                }, {
                    key: 'formatSubPath',
                    value: function formatSubPath(id, config) {

                        var result = id.toString();

                        if (_.has(config, 'sub_path') && config.sub_path.length > 0) {

                            result += _.startsWith(config.sub_path, '/') ? '' : '/';
                            result += config.sub_path;
                        }

                        return result;
                    }

                    /**
                     * delete
                     *
                     * @param  {ActiveRecord Class} active_record_class
                     * @param  {Integer} id
                     * @param  {Object} request_config = {}
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: 'delete',
                    value: function _delete(active_record_class, id) {
                        var request_config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                        if (_.isNull(id) || _.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_IS_REQURIED);
                        }

                        // request config
                        request_config.method = 'DELETE';
                        request_config.sub_path = this.formatSubPath(id, request_config);

                        // request ...
                        return this.request(active_record_class, request_config);
                    }

                    /**
                     * request
                     *
                     * @param  {Function} active_record_class
                     * @param  {Object} config
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: 'request',
                    value: function request(active_record_class) {
                        var _this = this;

                        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                        // NOTE:
                        // using RestApi instead of this for these checks because we can't test otherwise
                        // and testing like this doesn't work (TODO: find out why):
                        //   expect( RestApi.request.bind( RestApi ) ).toThrowError( ... );

                        if (_.isNull(RestApi.http)) {
                            throw new Error(MESSAGE_HTTP_REQUIRED);
                        }

                        // update params

                        var response_handler = this.responseHandler;
                        if (_.has(config, 'responseHandler')) {
                            response_handler = config.responseHandler;
                            delete config.responseHandler; // clean config
                        }

                        var response_transformer = this.responseTransformer;
                        if (_.has(config, 'responseTransformer')) {
                            response_transformer = config.responseTransformer;
                            delete config.responseTransformer; // clean config
                        }

                        var success_handler = this.successHandler || response_handler;
                        if (_.has(config, 'successHandler')) {
                            success_handler = config.successHandler;
                            delete config.successHandler; // clean config
                        }

                        var success_transformer = this.successTransformer || response_transformer;
                        if (_.has(config, 'successTransformer')) {
                            success_transformer = config.successTransformer;
                            delete config.successTransformer; // clean config
                        }

                        var error_handler = this.errorHandler || response_handler;
                        if (_.has(config, 'errorHandler')) {
                            error_handler = config.errorHandler;
                            delete config.errorHandler; // clean config
                        }

                        var error_transformer = this.errorTransformer || response_transformer;
                        if (_.has(config, 'errorTransformer')) {
                            error_transformer = config.errorTransformer;
                            delete config.errorTransformer; // clean config
                        }

                        // update request config

                        config.headers = _.has(config, 'headers') ? _.merge(this.headers, config.headers) : this.headers;

                        if (!_.has(config, 'paramSerializer') && !_.isNull(this.paramSerializer)) {
                            config.paramSerializer = this.paramSerializer;
                        }

                        if (!_.has(config, 'url')) {
                            var _url = this.url(active_record_class, config);

                            if (!_.isNull(_url)) {
                                config.url = _url;
                            }
                        }

                        if (_.has(config, 'sub_path')) {
                            config.url += '/' + config.sub_path;
                            delete config.sub_path; // clean config
                        }

                        if (this._cache_control && (!_.has(config, 'method') || config.method === 'GET')) {
                            if (!_.isObject(config.params)) {
                                config.params = {};
                            }

                            config.params.cache = new Date().getTime();
                        }

                        return new Promise(function (resolve, reject) {

                            var http_promise = RestApi.http(config);

                            // if HTTP Service is invalid
                            if (_.isUndefined(http_promise) || typeof http_promise !== 'object' || _.isUndefined(http_promise.then) && _.isUndefined(http_promise.subscribe)) {
                                throw new Error(MESSAGE_INVALID_HTTP_SERVICE);
                            }

                            if (typeof http_promise.then === 'function') {
                                http_promise.then(function (response) {
                                    return _this.onSuccess(response, active_record_class, resolve, reject, success_transformer, success_handler);
                                }, function (response) {
                                    return _this.onError(response, active_record_class, resolve, reject, error_transformer, error_handler);
                                });
                            } else if (typeof http_promise.subscribe === 'function') {
                                http_promise.subscribe(function (response) {
                                    return _this.onSuccess(response.json(), active_record_class, resolve, reject, success_transformer, success_handler);
                                }, function (response) {
                                    return _this.onError(response.json(), active_record_class, resolve, reject, error_transformer, error_handler);
                                });
                            }
                        });
                    }
                }, {
                    key: 'onSuccess',
                    value: function onSuccess(response, active_record_class, resolve, reject, success_transformer, success_handler) {
                        var _this2 = this;

                        var result = response;

                        // transformer
                        if (!_.isNull(success_transformer) && typeof success_transformer === 'function') {

                            result = success_transformer(response, active_record_class);
                        }

                        // if no handler
                        if (_.isNull(success_handler) || typeof success_handler !== 'function') {

                            resolve(result);

                            // TODO: remove this to make is less angular and more vanilla javascript
                            if (this.scope && this.timeout) {
                                this.timeout(function () {
                                    _this2.scope.$apply();
                                });
                            }

                            return true;
                        }

                        // handler
                        success_handler(result).then(resolve, reject);

                        // TODO: remove this to make is less angular and more vanilla javascript
                        if (this.scope && this.timeout) {
                            this.timeout(function () {
                                _this2.scope.$apply();
                            });
                        }
                    }
                }, {
                    key: 'onError',
                    value: function onError(response, active_record_class, resolve, reject, error_transformer, error_handler) {
                        var _this3 = this;

                        var result = response;

                        // transformer
                        if (!_.isNull(error_transformer) && typeof error_transformer === 'function') {
                            result = error_transformer(response, active_record_class);
                        }

                        // if no handler
                        if (_.isNull(error_handler) || typeof error_handler !== 'function') {

                            reject(result);

                            // TODO: remove this to make is less angular and more vanilla javascript
                            if (this.scope && this.timeout) {
                                this.timeout(function () {
                                    _this3.scope.$apply();
                                });
                            }

                            return false;
                        }

                        // handler
                        error_handler(result).then(resolve, reject);

                        // TODO: remove this to make is less angular and more vanilla javascript
                        if (this.scope && this.timeout) {
                            this.timeout(function () {
                                _this3.scope.$apply();
                            });
                        }
                    }

                    /**
                     * reset
                     */
                }, {
                    key: 'reset',
                    value: function reset() {

                        // defaults
                        this._cache_control = null;
                        this._error_handler = null;
                        this._error_transformer = null;
                        this._headers = {};
                        this._hostname = null;
                        this._http = null;
                        this._path = null;
                        this._path_generator = null;
                        this._param_serializer = null;
                        this._response_handler = null;
                        this._response_transformer = null;
                        this._success_handler = null;
                        this._success_transformer = null;
                        this._scope = null;
                        this._timeout = null;
                        this._url = null;
                    }
                }, {
                    key: 'cacheControl',

                    /**
                     * cacheControl
                     */
                    get: function get() {
                        return this._cache_control;
                    },
                    set: function set(value) {
                        this._cache_control = value;
                    }

                    /**
                     * errorHandler
                     */
                }, {
                    key: 'errorHandler',
                    get: function get() {
                        return this._error_handler;
                    },
                    set: function set(value) {
                        this._error_handler = value;
                    }

                    /**
                     * errorTransformer
                     */
                }, {
                    key: 'errorTransformer',
                    get: function get() {
                        return this._error_transformer;
                    },
                    set: function set(value) {
                        this._error_transformer = value;
                    }

                    /**
                     * headers
                     * HTTP request headers
                     */
                }, {
                    key: 'headers',
                    get: function get() {
                        return this._headers;
                    },
                    set: function set(value) {
                        this._headers = value;
                    }

                    /**
                     * hostname
                     * API hostname to use in HTTP requests
                     */
                }, {
                    key: 'hostname',
                    get: function get() {
                        return this._hostname;
                    },
                    set: function set(value) {
                        this._hostname = value;
                    }

                    /**
                     * http
                     * AngularJS $http service
                     */
                }, {
                    key: 'http',
                    get: function get() {
                        return this._http;
                    },
                    set: function set(value) {
                        this._http = value;
                    }

                    /**
                     * paramSerializer
                     * will be attached to http.paramSerializer if none is provided with request config
                     */
                }, {
                    key: 'paramSerializer',
                    get: function get() {
                        return this._param_serializer;
                    },
                    set: function set(value) {
                        this._param_serializer = value;
                    }

                    /*
                     * pathGenerator
                     * Used to generate API Path when no path is available & active record class is set,
                     * will be passed the _.snakeCase of the active record class name
                     */
                }, {
                    key: 'pathGenerator',
                    get: function get() {
                        return this._path_generator;
                    },
                    set: function set(value) {
                        this._path_generator = value;
                    }

                    /**
                     * responseHandler
                     */
                }, {
                    key: 'responseHandler',
                    get: function get() {
                        return this._response_handler;
                    },
                    set: function set(value) {
                        this._response_handler = value;
                    }

                    /**
                     * responseTransformer
                     */
                }, {
                    key: 'responseTransformer',
                    get: function get() {
                        return this._response_transformer;
                    },
                    set: function set(value) {
                        this._response_transformer = value;
                    }

                    /**
                     * successHandler
                     */
                }, {
                    key: 'successHandler',
                    get: function get() {
                        return this._success_handler;
                    },
                    set: function set(value) {
                        this._success_handler = value;
                    }

                    /**
                     * successTransformer
                     */
                }, {
                    key: 'successTransformer',
                    get: function get() {
                        return this._success_transformer;
                    },
                    set: function set(value) {
                        this._success_transformer = value;
                    }

                    /**
                     * scope
                     */
                }, {
                    key: 'scope',
                    get: function get() {
                        return this._scope;
                    },
                    set: function set(value) {
                        this._scope = value;
                    }

                    /**
                     * timeout
                     */
                }, {
                    key: 'timeout',
                    get: function get() {
                        return this._timeout;
                    },
                    set: function set(value) {
                        this._timeout = value;
                    }
                }]);

                return RestApi;
            })();

            RestApi.reset();

            // constants
            RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED = MESSAGE_HOSTNAME_AND_PATH_REQURIED;
            RestApi.MESSAGE_HTTP_REQUIRED = MESSAGE_HTTP_REQUIRED;
            RestApi.MESSAGE_ID_IS_REQURIED = MESSAGE_ID_IS_REQURIED;
            RestApi.MESSAGE_INVALID_HTTP_SERVICE = MESSAGE_INVALID_HTTP_SERVICE;

            _export('default', RestApi);
        }
    };
});