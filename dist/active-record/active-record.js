System.register(['../angular-cakephp', 'lodash'], function (_export) {
    'use strict';

    var RestApi, BaseModel, _, MESSAGE_DELETE_ERROR_NO_ID, MESSAGE_VIEW_ERROR_NO_ID, ActiveRecord;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_angularCakephp) {
            RestApi = _angularCakephp.RestApi;
            BaseModel = _angularCakephp.BaseModel;
        }, function (_lodash) {
            _ = _lodash['default'];
        }],
        execute: function () {
            MESSAGE_DELETE_ERROR_NO_ID = 'Can not delete record with no ID';
            MESSAGE_VIEW_ERROR_NO_ID = 'Can not view record with no ID';

            /**
             * Class ActiveRecord
             */

            ActiveRecord = (function () {

                /**
                 * @constructor
                 * @param  {Object} data  = {}
                 * @param  {Class Instance} model = null
                 * @param  {Boolean} map_data = true
                 */

                function ActiveRecord() {
                    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                    var model = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                    var map_data = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                    _classCallCheck(this, ActiveRecord);

                    this.model = !_.isNull(model) ? model : BaseModel;
                    this.mapData = !_.isNull(map_data) ? map_data : true;

                    // map data
                    if (this.mapData) {
                        for (var prop in data) {
                            this[prop] = data[prop];
                        }
                    }
                }

                // constants

                /**
                 * mapData
                 * Whether or not to atomatically map provided data to class properties
                 */

                _createClass(ActiveRecord, [{
                    key: 'getClassName',

                    /**
                     * getClassName
                     */
                    value: function getClassName() {
                        // get Active Record class name from Class.constructor.name if it's not 'Function', otherwise  get from Class.name
                        return this.constructor.name !== 'Function' ? this.constructor.name : !_.isUndefined(this.name) ? this.name : null;
                    }

                    //-----------------------
                    // methods
                    //-----------------------

                    /**
                     * view
                     * @param  {Object} config = {}
                     * @return {Promise}
                     */
                }, {
                    key: 'view',
                    value: function view() {
                        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                        // view (no id)
                        if (!_.has(this, 'id') || _.isUndefined(this.id)) {
                            throw new Error(MESSAGE_VIEW_ERROR_NO_ID);
                        }

                        // edit
                        return this.model.view(this.constructor, this.id, config);
                    }

                    /**
                     * save
                     * runs RestApi save or edit depending on whether anid is set
                     *
                     * @param  {Object} config = {}
                     * @return {Promise}
                     */
                }, {
                    key: 'save',
                    value: function save() {
                        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                        // add (no id)
                        if (!_.has(this, 'id') || _.isUndefined(this.id)) {
                            return this.model.add(this.constructor, this, config);
                        }

                        // edit
                        return this.model.edit(this.constructor, this.id, this, config);
                    }

                    /**
                     * delete
                     *
                     * @param  {Object} config = {}
                     * @return {Promise}
                     */
                }, {
                    key: 'delete',
                    value: function _delete() {
                        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                        // no id
                        if (!_.has(this, 'id') || _.isUndefined(this.id)) {
                            throw new Error(MESSAGE_DELETE_ERROR_NO_ID);
                        }

                        // delete
                        return this.model['delete'](this.constructor, this.id, config);
                    }
                }, {
                    key: 'mapData',
                    get: function get() {
                        return this._map_data;
                    },
                    set: function set(value) {
                        this._map_data = value;
                    }

                    /**
                     * model
                     */
                }, {
                    key: 'model',
                    get: function get() {
                        return this._model;
                    },
                    set: function set(value) {
                        this._model = value;
                    }
                }]);

                return ActiveRecord;
            })();

            _export('default', ActiveRecord);

            ActiveRecord.MESSAGE_DELETE_ERROR_NO_ID = MESSAGE_DELETE_ERROR_NO_ID;
            ActiveRecord.MESSAGE_VIEW_ERROR_NO_ID = MESSAGE_VIEW_ERROR_NO_ID;
        }
    };
});