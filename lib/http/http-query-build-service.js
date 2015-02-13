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