(function() {

    'use strict';

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
