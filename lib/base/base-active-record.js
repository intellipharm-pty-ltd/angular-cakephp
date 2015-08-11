(function() {

    'use strict';

    //---------------------------------------------------
    // Base Active Record
    // these properties and methods will be available to all model services
    //---------------------------------------------------

    // extend errors
    var ERROR_MISSING_PARAMS            = 'Missing Required Params';

    // virtual field errors
    var ERROR_VIRTUAL_FIELD_NAME                    = 'Name argument is required';
    var ERROR_VIRTUAL_FIELD_NAME_NOT_STRING         = 'Name argument needs to be a string';
    var ERROR_VIRTUAL_FIELD_NAME_NOT_FIELD          = 'Name argument is not in the object';
    var ERROR_VIRTUAL_FIELD_NAME_NOT_VIRTUAL_FIELD  = 'Name argument is not a virtual field';
    var ERROR_VIRTUAL_FIELD_VALUE                   = 'Value argument is required';
    var ERROR_VIRTUAL_FIELD_VALUE_NOT_FUNCTION      = 'Value argument needs to be a function';

    /**
     * BaseActiveRecord
     *
     * @constructor
     */
    function BaseActiveRecord() {
        this.model = null;
    }

    BaseActiveRecord.$inject = [];

    //-----------------------------------------------
    // extend
    //-----------------------------------------------

    /**
     * extend
     * Extends BaseActiveRecord
     *
     * @param model (the model being used to call this method)
     * @param active_record (The active record class that will extend BaseActiveRecord)
     * @return active record instance
     */
    BaseActiveRecord.prototype.extend = function(model, data) {
        if (_.isUndefined(model) || !_.has(model, 'active_record_class')  || _.isUndefined(model.active_record_class) || _.isUndefined(data)) {
            throw new Error(ERROR_MISSING_PARAMS);
        }

        // extend active record
        model.active_record_class.prototype = Object.create(BaseActiveRecord.prototype);

        // create new active record instance
        var instance = new model.active_record_class(data);

        // set the standard cakephp created and modified timestamps if wanted
        if (model.config.timestamps) {
            instance.created = data.created;
            instance.modified = data.modified;
        }

        // set instance properties
        Object.defineProperty(instance, 'model', {
            configurable: false,
            enumerable: false,
            value: model,
            writable: false
        });

        // return active record instance
        return instance;
    };

    //-----------------------------------------------
    // clone
    //-----------------------------------------------

    /**
     * clone
     * Extends BaseActiveRecord
     *
     * @return cloned active record instance
     */
    BaseActiveRecord.prototype.clone = function() {
        return this.new(this);
    };

    //-----------------------------------------------
    // C.R.U.D
    //-----------------------------------------------

    /**
     * save
     * Relay call to the model's edit method
     *
     * @param {Object} params (a list of url parameters to pass with the HTTP request)
     * @return {promise}
     */
    BaseActiveRecord.prototype.save = function(params) {

        if (this.id) {
            return this.model.edit(this.id, this, params);
        }

        return this.model.add(this, params);
    };

    /**
     * new
     * Relay call to the model's new method
     *
     * @return promise
     */
    BaseActiveRecord.prototype.new = function(data) {
        return this.model.new(data);
    };

    /**
     * delete
     * Relay call to the model's delete method
     *
     * @return promise
     */
    BaseActiveRecord.prototype.delete = function() {
        return this.model.delete(this.id);
    };

    //-----------------------------------------------
    // validation
    //-----------------------------------------------

    /**
     * validate
     * Relay call to the model's validate method
     *
     * @param array fields (array of fields to validate)
     * @return promise
     */
    BaseActiveRecord.prototype.validate = function(fields) {
        return this.model.validate(this, fields);
    };

    /**
     * api
     * Relay call to the model's api method
     *
     * @param string endpoint (endpoint to call)
     * @param string http_method (HTTP method to use for call) (default: GET)
     * @param object url_params (url params to pass with call)
     * @return promise
     */
    BaseActiveRecord.prototype.api = function(end_point, http_method, url_params) {
        return this.model.api(end_point, http_method, url_params, this);
    };

    //-----------------------------------------------
    // helper methods
    //-----------------------------------------------

    /**
     * getClassName
     * Returns active record class name
     *
     * @return promise
     */
    BaseActiveRecord.prototype.getClassName = function() {
        return this.model && this.model.active_record_class ? this.model.active_record_class.name : null;
    };

    //-----------------------------------------------
    // virtualField
    // TODO: fix tests & insure this is thoroughly tested (see notes below)
    //-----------------------------------------------

    /**
     * virtualField
     * Returns computed property / virtual field by concatenating multiple properties
     *
     * @param string name (name of the virtual field)
     * @param function valueFn (?) // TODO: unabbreviate & name more clearly
     * @return {construct}
     */
    BaseActiveRecord.prototype.virtualField = function(name, valueFn) {
        var virtualValue;

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
            set: function() {
                virtualValue = valueFn.apply(this);
                return virtualValue;
            }
        });

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
     * @param string name (name of virtual field to update)
     * @return this
     */
    BaseActiveRecord.prototype.virtualFieldUpdate = function(name) {
        if (!name) {
            throw new Error(ERROR_VIRTUAL_FIELD_NAME);
        }

        if (typeof name !== 'string') {
            throw new Error(ERROR_VIRTUAL_FIELD_NAME_NOT_STRING);
        }

        if (!_.has(this, name)) {
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
