(function() {

    'use strict';

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
	 * @returns active record instance
	 */
	BaseActiveRecord.prototype.extend = function(model, data) {

		if (_.isUndefined(model) || !_.has(model, 'active_record_class')  || _.isUndefined(model.active_record_class) || _.isUndefined(data)) {
			throw new Error(ERROR_MISSING_PARAMS);
		}

		// extend active record
		model.active_record_class.prototype = Object.create(BaseActiveRecord.prototype);

		// create new active record instance
		var instance = new model.active_record_class(data);


		// set instance properties
		instance.model = model;

		// return active record instance
		return instance;
	};

	//-----------------------------------------------
	// C.R.U.D
	//-----------------------------------------------

	/**
	 * save
	 * Relay call to the model's edit method
	 *
	 * @returns promise
	 */
	BaseActiveRecord.prototype.save = function() {

		if (this.id) {
			return this.model.edit(this.id, this);
		}

		return this.model.add(this);
	};

	/**
	 * new
	 * Relay call to the model's new method
	 *
	 * @returns promise
	 */
	BaseActiveRecord.prototype.new = function(data) {
		return this.model.new(data);
	};

	/**
	 * delete
	 * Relay call to the model's delete method
	 *
	 * @returns promise
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
	 * @returns promise
	 */
	BaseActiveRecord.prototype.validate = function(fields) {
		return this.model.validate(this, fields);
	};

	//-----------------------------------------------
	// helper methods
	//-----------------------------------------------

	/**
	 * getClassName
	 * Returns active record class name
	 *
	 * @returns promise
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
	 * @returns this
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
