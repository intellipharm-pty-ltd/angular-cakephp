System.register(['./rest-api/rest-api', './base-model/base-model', './active-record/active-record'], function (_export) {

    // IE Hack
    'use strict';

    var RestApi, BaseModel, ActiveRecord;
    return {
        setters: [function (_restApiRestApi) {
            RestApi = _restApiRestApi['default'];
        }, function (_baseModelBaseModel) {
            BaseModel = _baseModelBaseModel['default'];
        }, function (_activeRecordActiveRecord) {
            ActiveRecord = _activeRecordActiveRecord['default'];
        }],
        execute: function () {
            if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
                Object.defineProperty(Function.prototype, 'name', {
                    get: function get() {
                        var funcNameRegex = /function\s([^(]{1,})\(/;
                        var results = funcNameRegex.exec(this.toString());
                        return results && results.length > 1 ? results[1].trim() : "";
                    },
                    set: function set(value) {}
                });
            }

            _export('RestApi', RestApi);

            _export('BaseModel', BaseModel);

            _export('ActiveRecord', ActiveRecord);
        }
    };
});