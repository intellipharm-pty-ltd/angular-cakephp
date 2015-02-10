'use strict';

(function() {

	//---------------------------------------------------
	// Util Service
	//---------------------------------------------------

	var DataModelUtilService = function($injector) {

		var self = this;

		this.ERROR_MODEL_DOES_NOT_EXIST = 'Model does not exist';

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

	DataModelUtilService.$inject = ['$injector'];

	angular.module('DataModel').service('DataModelUtilService', DataModelUtilService);

})();
