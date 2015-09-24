System.register(['../angular-cakephp', 'lodash'], function (_export) {
    'use strict';

    var ActiveRecord, RestApi, _, MESSAGE_ID_REQURIED, MESSAGE_DATA_REQURIED, BaseModel;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_angularCakephp) {
            ActiveRecord = _angularCakephp.ActiveRecord;
            RestApi = _angularCakephp.RestApi;
        }, function (_lodash) {
            _ = _lodash['default'];
        }],
        execute: function () {
            MESSAGE_ID_REQURIED = "Please provide an ID";
            MESSAGE_DATA_REQURIED = "Please provide data";

            /**
             * Class BaseModel
             */

            BaseModel = (function () {
                function BaseModel() {
                    _classCallCheck(this, BaseModel);
                }

                // defaults

                _createClass(BaseModel, null, [{
                    key: 'new',

                    /**
                     * new
                     *
                     * @param  {ActiveRecord Class} active_record_class = null
                     * @param  {Object} data = {}
                     * @param  {Boolean} map_data = null
                     * @return {Promise}
                     */
                    value: function _new() {
                        var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                        var active_record_class = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                        var map_data = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        if (!_.isNull(this.activeRecordClass)) {
                            return new this.activeRecordClass(data, this, map_data);
                        }

                        return data;
                    }

                    /**
                     * index
                     *
                     * @param  {Object} config = {}
                     * @param  {Class} active_record_class = null
                     * @return {Promise}
                     */
                }, {
                    key: 'index',
                    value: function index() {
                        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                        var active_record_class = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        return RestApi.index(config, this.activeRecordClass);
                    }

                    /**
                     * view
                     * @param  {Integer} id
                     * @param  {Object} config = {}
                     * @param  {Class} active_record_class = null
                     * @return {Promise}
                     */
                }, {
                    key: 'view',
                    value: function view(id) {
                        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var active_record_class = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        if (_.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_REQURIED);
                        }

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        return RestApi.view(id, config, this.activeRecordClass);
                    }

                    /**
                     * add
                     * @param  {Object} data
                     * @param  {Object} config = {}
                     * @param  {Class} active_record_class = null
                     * @return {Promise}
                     */
                }, {
                    key: 'add',
                    value: function add(data) {
                        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var active_record_class = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        if (_.isUndefined(data)) {
                            throw new Error(MESSAGE_DATA_REQURIED);
                        }

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        return RestApi.add(config, data, this.activeRecordClass);
                    }

                    /**
                     * edit
                     * @param  {Integer} id
                     * @param  {Object} data
                     * @param  {Object} config = {}
                     * @param  {Class} active_record_class = null
                     * @return {Promise}
                     */
                }, {
                    key: 'edit',
                    value: function edit(id, data) {
                        var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
                        var active_record_class = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                        if (_.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_REQURIED);
                        }

                        if (_.isUndefined(data)) {
                            throw new Error(MESSAGE_DATA_REQURIED);
                        }

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        return RestApi.edit(id, config, data, this.activeRecordClass);
                    }

                    /**
                     * delete
                     * @param  {Integer} id
                     * @param  {Object} config = {}
                     * @param  {Class} active_record_class = null
                     * @return {Promise}
                     */
                }, {
                    key: 'delete',
                    value: function _delete(id) {
                        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var active_record_class = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        if (_.isUndefined(id)) {
                            throw new Error(MESSAGE_ID_REQURIED);
                        }

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        return RestApi['delete'](id, config, this.activeRecordClass);
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
                    key: 'request',
                    value: function request() {
                        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                        var active_record_class = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                        if (!_.isNull(active_record_class)) {
                            this.activeRecordClass = active_record_class;
                        }

                        return RestApi.request(config, this.activeRecordClass);
                    }

                    /**
                     * reset
                     */
                }, {
                    key: 'reset',
                    value: function reset() {

                        // defaults
                        this._active_record_class = null;
                    }
                }, {
                    key: 'activeRecordClass',

                    /**
                     * activeRecordClass
                     * class used to create active record instances from request results
                     */
                    get: function get() {
                        return this._active_record_class;
                    },
                    set: function set(value) {
                        this._active_record_class = value;
                    }
                }]);

                return BaseModel;
            })();

            BaseModel.reset();

            _export('default', BaseModel);
        }
    };
});