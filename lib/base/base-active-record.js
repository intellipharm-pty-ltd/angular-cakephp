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

	angular.module('DataModel').service('BaseActiveRecord', BaseActiveRecord);
})();
