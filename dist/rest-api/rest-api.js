System.register(["lodash"], function (_export) {
    "use strict";

    var _, MESSAGE_HOSTNAME_AND_PATH_REQURIED, MESSAGE_HTTP_REQUIRED, MESSAGE_ID_IS_REQURIED, MESSAGE_INVALID_HTTP_SERVICE, RestApi;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [function (_lodash) {
            _ = _lodash["default"];
        }],
        execute: function () {
            MESSAGE_HOSTNAME_AND_PATH_REQURIED = "Please configure an API hostname & path before making a request";
            MESSAGE_HTTP_REQUIRED = "Please provide HTTP service";
            MESSAGE_ID_IS_REQURIED = "Please provide an ID with request";
            MESSAGE_INVALID_HTTP_SERVICE = "http is invalid";

            /**
             * Class RestApi
             */

            RestApi = (function () {
                function RestApi() {
                    _classCallCheck(this, RestApi);
                }

                // defaults

                _createClass(RestApi, null, [{
                    key: "index",

                    /**
                     * index
                     *
                     * @param  {Object} request_config = {}
                     * @param  {ActiveRecord Class} active_record_class = null
                     * @return {Promise}
                     * @throws {Error}
                     */
                    value: function index() {
                        var request_config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                        var active_record_class = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                        // update class properties

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        // request config

                        request_config.method = "GET";
                        request_config.url = this.url;
                        request_config.headers = _.has(request_config, 'headers') ? _.merge(request_config.headers, this.headers) : this.headers;

                        // request ...
                        return this.request(request_config);
                    }

                    /**
                     * view
                     *
                     * @param  {Integer} id
                     * @param  {Object} request_config = {}
                     * @param  {ActiveRecord Class} active_record_class = null
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: "view",
                    value: function view(id) {
                        var request_config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var active_record_class = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        if (_.isNull(id) || _.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_IS_REQURIED);
                        }

                        // update class properties

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        // request config

                        request_config.method = "GET";
                        request_config.url = this.url + '/' + id;
                        request_config.headers = _.has(request_config, 'headers') ? _.merge(request_config.headers, this.headers) : this.headers;

                        // request ...
                        return this.request(request_config);
                    }

                    /**
                     * add
                     *
                     * @param  {Object} request_config = {}
                     * @param  {Object} request_data = {}
                     * @param  {ActiveRecord Class} active_record_class = null
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: "add",
                    value: function add() {
                        var request_config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                        var request_data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var active_record_class = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        // update class properties

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        // request config

                        request_config.method = "POST";
                        request_config.url = this.url;
                        request_config.data = request_data;
                        request_config.headers = _.has(request_config, 'headers') ? _.merge(request_config.headers, this.headers) : this.headers;

                        // request ...
                        return this.request(request_config);
                    }

                    /**
                     * edit
                     *
                     * @param  {Integer} id
                     * @param  {Object} request_config = {}
                     * @param  {Object} request_data = {}
                     * @param  {ActiveRecord Class} active_record_class = null
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: "edit",
                    value: function edit(id) {
                        var request_config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var request_data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
                        var active_record_class = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                        if (_.isNull(id) || _.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_IS_REQURIED);
                        }

                        // update class properties

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        // request config

                        request_config.method = "PUT";
                        request_config.url = this.url + '/' + id;
                        request_config.data = request_data;
                        request_config.headers = _.has(request_config, 'headers') ? _.merge(request_config.headers, this.headers) : this.headers;

                        // request ...
                        return this.request(request_config);
                    }

                    /**
                     * delete
                     *
                     * @param  {Integer} id
                     * @param  {Object} request_config = {}
                     * @param  {ActiveRecord Class} active_record_class = null
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: "delete",
                    value: function _delete(id) {
                        var request_config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var active_record_class = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        if (_.isNull(id) || _.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_IS_REQURIED);
                        }

                        // update class properties

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        // request config

                        request_config.method = "DELETE";
                        request_config.url = this.url + '/' + id;
                        request_config.headers = _.has(request_config, 'headers') ? _.merge(request_config.headers, this.headers) : this.headers;

                        // request ...
                        return this.request(request_config);
                    }

                    /**
                     * request
                     *
                     * @param  {Object} config
                     * @param  {Function} active_record_class = null
                     * @param  {Function} responseTransformer = null
                     * @param  {Function} errorHandler = null
                     * @return {Promise}
                     * @throws {Error}
                     */
                }, {
                    key: "request",
                    value: function request() {
                        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                        var active_record_class = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                        var _this = this;

                        var response_transformer = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
                        var error_handler = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                        if (_.isNull(this.http)) {
                            throw new Error(MESSAGE_HTTP_REQUIRED);
                        }

                        // update class properties

                        if (!_.isNull(response_transformer)) {
                            this.responseTransformer = response_transformer;
                        }

                        if (!_.isNull(error_handler)) {
                            this.errorHandler = error_handler;
                        }

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        if (_.has(config, 'hostname')) {
                            this.hostname = config.hostname;
                            delete config.hostname; // clean config
                        }

                        if (_.has(config, 'path')) {
                            this.path = config.path;
                            delete config.path; // clean config
                        }

                        // update request config

                        if (!_.has(config, 'paramSerializer')) {

                            var _param_serializer = this.paramSerializer;

                            if (!_.isNull(_param_serializer)) {
                                config.paramSerializer = _param_serializer;
                            }
                        }

                        if (!_.has(config, 'url')) {

                            var _url = this.url;

                            if (!_.isNull(_url)) {
                                config.url = _url;
                            }
                        }

                        if (_.has(config, 'sub_path')) {
                            config.url += '/' + config.sub_path;
                            delete config.sub_path; // clean config
                        }

                        return new Promise(function (resolve, reject) {

                            var _promise = _this.http(config);

                            if (_.isUndefined(_promise) || typeof _promise !== 'object' || _.isUndefined(_promise.then)) {
                                throw new Error(MESSAGE_INVALID_HTTP_SERVICE);
                            }

                            _promise.then(function (response) {

                                // response transformer

                                var _response_transformer = _this.responseTransformer;

                                if (!_.isNull(_response_transformer) && typeof _response_transformer === 'function') {
                                    resolve(_response_transformer(response, _this.activeRecordClass));
                                    return;
                                }

                                // no response transformer
                                resolve(response);
                            }, function (response) {

                                // error handler

                                var _error_handler = _this.errorHandler;

                                if (!_.isNull(_error_handler) && typeof _error_handler === 'function') {
                                    reject(_error_handler(response));
                                    return;
                                }

                                // no error handler
                                reject(response);
                            });
                        });
                    }

                    /**
                     * reset
                     */
                }, {
                    key: "reset",
                    value: function reset() {

                        // defaults
                        this._active_record_class = null;
                        this._error_handler = null;
                        this._headers = {};
                        this._hostname = null;
                        this._http = null;
                        this._path = null;
                        this._path_generator = null;
                        this._param_serializer = null;
                        this._response_transformer = null;
                        this._url = null;
                    }
                }, {
                    key: "activeRecordClass",

                    /**
                     * activeRecordClass
                     */
                    get: function get() {
                        return this._active_record_class;
                    },
                    set: function set(value) {
                        this._active_record_class = value;
                    }

                    /**
                     * errorHandler
                     */
                }, {
                    key: "errorHandler",
                    get: function get() {
                        return this._error_handler;
                    },
                    set: function set(value) {
                        this._error_handler = value;
                    }

                    /**
                     * headers
                     * HTTP request headers
                     */
                }, {
                    key: "headers",
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
                    key: "hostname",
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
                    key: "http",
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
                    key: "paramSerializer",
                    get: function get() {
                        return this._param_serializer;
                    },
                    set: function set(value) {
                        this._param_serializer = value;
                    }

                    /**
                     * path
                     * API path to use in HTTP requests
                     * if no path is available & active record class is set then pathGenerator will be used to generate API path
                     */
                }, {
                    key: "path",
                    get: function get() {
                        if (_.isNull(this._path) && !_.isNull(this.pathGenerator) && !_.isNull(this.activeRecordClass)) {
                            this.path = this.pathGenerator(_.snakeCase(this.activeRecordClass.name));
                        }
                        return this._path;
                    },
                    set: function set(value) {
                        this._path = value;
                    }

                    /**
                     * pathGenerator
                     * Used to generate API Path when no path is available & active record class is set,
                     * will be passed the _.snakeCase of the active record class name
                     */
                }, {
                    key: "pathGenerator",
                    get: function get() {
                        return this._path_generator;
                    },
                    set: function set(value) {
                        this._path_generator = value;
                    }

                    /**
                     * responseTransformer
                     */
                }, {
                    key: "responseTransformer",
                    get: function get() {
                        return this._response_transformer;
                    },
                    set: function set(value) {
                        this._response_transformer = value;
                    }

                    /**
                     * url
                     */
                }, {
                    key: "url",
                    get: function get() {

                        var hostname = this.hostname;
                        var path = this.path;

                        if (_.isNull(this._url) && (_.isNull(hostname) || _.isNull(path))) {
                            throw new Error(MESSAGE_HOSTNAME_AND_PATH_REQURIED);
                        }

                        // create url from hostname and path
                        if (_.isNull(this._url)) {
                            this._url = hostname + path;
                        }

                        return this._url;
                    },
                    set: function set(value) {
                        this._url = value;
                    }
                }]);

                return RestApi;
            })();

            RestApi.reset();

            // constants
            RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED = MESSAGE_HOSTNAME_AND_PATH_REQURIED;
            RestApi.MESSAGE_HTTP_REQUIRED = MESSAGE_HTTP_REQUIRED;
            RestApi.MESSAGE_ID_IS_REQURIED = MESSAGE_ID_IS_REQURIED;

            _export("default", RestApi);
        }
    };
});